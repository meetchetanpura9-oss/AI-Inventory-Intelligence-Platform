from __future__ import annotations

import csv
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from io import StringIO

from sqlalchemy.orm import Session

from app.customer_search.models import CustomerSearch
from app.demand.models import ProductDemand
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.purchase import Purchase
from app.models.sale import Sale

from app.modules.weather.service import weather_service
from app.modules.festival.service import festival_service
from app.modules.season.season import season_engine


DATASET_COLUMNS = [
    "date",
    "product",
    "category",
    "sku",
    "warehouse",
    "city",
    "state",
    "zone",
    "pincode",
    "stock",
    "minimum_stock",
    "maximum_stock",
    "warehouse_capacity",
    "stock_percentage",
    "sales",
    "today_sales",
    "yesterday_sales",
    "last_7_days_sales",
    "last_30_days_sales",
    "average_daily_sales",
    "purchase",
    "purchase_count",
    "failed_searches",
    "search_count",
    "demand_score",
    "demand_level",
    "revenue",
    "temperature",
    "humidity",
    "rain",
    "weather_type",
    "festival",
    "festival_days_left",
    "festival_multiplier",
    "weather_multiplier",
    "holiday",
    "diwali",
    "holi",
    "christmas",
    "navratri",
    "eid",
    "raksha_bandhan",
    "independence_day",
    "weekend",
    "day",
    "week",
    "month",
    "quarter",
    "year",
    "day_of_week",
    "moving_avg_7",
    "moving_avg_30",
    "sales_growth",
    "inventory_turnover",
    "days_since_last_purchase",
    "seasonal_indicator",
    "weather_score",
]


@dataclass
class DatasetBuildResult:
    rows: list[dict]
    duplicate_records_removed: int
    validation_errors: list[str]


class AIDatasetService:
    def get_dataset(self, db: Session, limit: int = 50, offset: int = 0) -> dict:
        build = self.build_dataset(db)
        total = len(build.rows)
        items = build.rows[offset:offset + limit]

        return {
            "items": items,
            "total": total,
            "limit": limit,
            "offset": offset,
            "summary": {
                "dataset_size": total,
                "columns": DATASET_COLUMNS,
                "missing_columns": self._missing_columns(items),
                "duplicate_records_removed": build.duplicate_records_removed,
                "validation_errors": build.validation_errors,
                "last_training_time": self._last_training_time(build.rows),
                "training_status": "READY" if total else "WAITING_FOR_DATA",
                "available_models": [
                    "baseline-moving-average",
                    "inventory-turnover-regressor",
                    "seasonal-demand-forecaster",
                ],
            },
        }

    def export_csv(self, db: Session) -> str:
        build = self.build_dataset(db)
        buffer = StringIO()
        writer = csv.DictWriter(buffer, fieldnames=DATASET_COLUMNS)
        writer.writeheader()
        writer.writerows(build.rows)
        return buffer.getvalue()

    def build_dataset(self, db: Session) -> DatasetBuildResult:
        products = db.query(Product).all()
        inventory_by_product = {
            item.product_id: item for item in db.query(Inventory).all()
        }
        sales = db.query(Sale).all()
        purchases = db.query(Purchase).all()
        demands = db.query(ProductDemand).all()
        searches = db.query(CustomerSearch).all()

        product_by_id = {product.id: product for product in products}
        product_name_to_id = {
            (product.product_name or "").strip().lower(): product.id
            for product in products
        }

        sales_by_key: dict[tuple[int, date], int] = defaultdict(int)
        purchases_by_key: dict[tuple[int, date], int] = defaultdict(int)
        searches_by_key: dict[tuple[int, date], dict] = defaultdict(
            lambda: {
                "search_count": 0,
                "failed_searches": 0,
                "city": None,
                "state": None,
                "temperature": None,
                "festival": False,
            }
        )
        demand_by_product: dict[int, ProductDemand] = {}
        dates_by_product: dict[int, set[date]] = defaultdict(set)
        validation_errors: list[str] = []

        for sale in sales:
            sale_date = self._to_date(sale.created_at)
            if not sale.product_id or not sale_date:
                validation_errors.append(f"Sale {sale.id} skipped because product/date is invalid")
                continue
            quantity = max(0, sale.quantity or 0)
            if sale.quantity is None:
                validation_errors.append(f"Sale {sale.id} has null quantity")
            if sale.quantity is not None and sale.quantity < 0:
                validation_errors.append(f"Sale {sale.id} has negative quantity")
            sales_by_key[(sale.product_id, sale_date)] += quantity
            dates_by_product[sale.product_id].add(sale_date)

        for purchase in purchases:
            purchase_date = self._to_date(purchase.created_at)
            if not purchase.product_id or not purchase_date:
                validation_errors.append(f"Purchase {purchase.id} skipped because product/date is invalid")
                continue
            quantity = max(0, purchase.quantity or 0)
            if purchase.quantity is not None and purchase.quantity < 0:
                validation_errors.append(f"Purchase {purchase.id} has negative quantity")
            purchases_by_key[(purchase.product_id, purchase_date)] += quantity
            dates_by_product[purchase.product_id].add(purchase_date)

        for demand in demands:
            current = demand_by_product.get(demand.product_id)
            if not current or self._sort_datetime(demand.updated_at) > self._sort_datetime(current.updated_at):
                demand_by_product[demand.product_id] = demand
            demand_date = self._to_date(demand.updated_at)
            if demand_date:
                dates_by_product[demand.product_id].add(demand_date)

        for search in searches:
            product_id = self._match_search_to_product(search, product_name_to_id)
            search_date = self._to_date(search.created_at)
            if not product_id or not search_date:
                continue
            bucket = searches_by_key[(product_id, search_date)]
            bucket["search_count"] += 1
            bucket["failed_searches"] += 0 if search.found else 1
            bucket["city"] = bucket["city"] or search.city
            bucket["state"] = bucket["state"] or search.state
            bucket["temperature"] = bucket["temperature"] if bucket["temperature"] is not None else search.temperature
            bucket["festival"] = bucket["festival"] or bool(search.festival)
            dates_by_product[product_id].add(search_date)

        rows = []
        seen_keys: set[tuple[date, int, str]] = set()
        duplicate_records_removed = 0

        for product in products:
            product_dates = dates_by_product.get(product.id) or {date.today()}
            sorted_dates = sorted(product_dates)
            last_purchase_date: date | None = None

            for row_date in sorted_dates:
                key = (product.id, row_date)
                inventory = inventory_by_product.get(product.id)
                demand = demand_by_product.get(product.id)
                search = searches_by_key[key]
                warehouse = self._warehouse_for_product(product.id)
                city = search["city"] or (demand.city if demand else None) or "Unknown"
                state = search["state"] or "Unknown"
                dedupe_key = (row_date, product.id, warehouse)
                if dedupe_key in seen_keys:
                    duplicate_records_removed += 1
                    continue
                seen_keys.add(dedupe_key)

                purchase_qty = purchases_by_key[key]
                if purchase_qty > 0:
                    last_purchase_date = row_date

                stock = max(0, inventory.quantity if inventory else 0)
                if inventory and inventory.quantity < 0:
                    validation_errors.append(f"Product {product.id} has negative stock")

                sales_qty = sales_by_key[key]
                search_count = search["search_count"] or (demand.search_count if demand else 0)
                failed_searches = search["failed_searches"] or (demand.failed_searches if demand else 0)
                temperature = self._temperature(search["temperature"], row_date)
                humidity = self._humidity(row_date)
                rain = self._rain(row_date)

                # Get contexts from weather / festival / season modules
                fest_ctx = festival_service.get_festival_context(row_date)
                festival = fest_ctx["in_festival"]
                festival_days_left = fest_ctx["days_left"]
                festival_multiplier = fest_ctx["multiplier"]

                weather_impact = weather_service.get_impact_analysis(temperature, humidity, rain)
                weather_multiplier = weather_impact["multiplier"]
                weather_score = weather_impact["impact_score"]
                weather_type = self._weather_type(temperature, humidity, row_date)

                season = season_engine.get_season_for_date(row_date)

                maximum_stock = max(0, inventory.maximum_stock if inventory else 100)
                minimum_stock = max(0, inventory.minimum_stock if inventory else 0)
                warehouse_capacity = max(maximum_stock, stock, 1)
                stock_percentage = round((stock / warehouse_capacity) * 100, 2)
                demand_score = float(demand.demand_score if demand else self._demand_score(search_count, failed_searches, sales_qty, stock))
                demand_level = demand.demand_level if demand else self._demand_level(demand_score)
                selling_price = float(product.selling_price or 0)

                festival_name = fest_ctx["festival_name"] or "None"

                rows.append({
                    "date": row_date,
                    "product": product.product_name or f"Product #{product.id}",
                    "sku": product.sku or f"SKU-{product.id}",
                    "category": product.category or "Uncategorized",
                    "warehouse": warehouse,
                    "city": city,
                    "state": state,
                    "zone": self._zone(city, state),
                    "pincode": self._pincode(product.id, city),
                    "stock": stock,
                    "minimum_stock": minimum_stock,
                    "maximum_stock": maximum_stock,
                    "warehouse_capacity": warehouse_capacity,
                    "stock_percentage": stock_percentage,
                    "sales": max(0, sales_qty),
                    "today_sales": max(0, sales_qty),
                    "yesterday_sales": 0,
                    "last_7_days_sales": 0,
                    "last_30_days_sales": 0,
                    "average_daily_sales": 0.0,
                    "purchase": max(0, purchase_qty),
                    "purchase_count": max(0, demand.purchase_count if demand else purchase_qty),
                    "failed_searches": max(0, failed_searches),
                    "search_count": max(0, search_count),
                    "demand_score": round(demand_score, 2),
                    "demand_level": demand_level,
                    "revenue": round(max(0, sales_qty) * selling_price, 2),
                    "temperature": temperature,
                    "humidity": humidity,
                    "rain": rain,
                    "weather_type": weather_type,
                    "festival": festival,
                    "festival_days_left": festival_days_left,
                    "festival_multiplier": festival_multiplier,
                    "weather_multiplier": weather_multiplier,
                    "holiday": festival or row_date.weekday() == 6,
                    "diwali": festival_name == "Diwali",
                    "holi": festival_name == "Holi",
                    "christmas": festival_name == "Christmas",
                    "navratri": festival_name == "Navratri",
                    "eid": festival_name == "Eid",
                    "raksha_bandhan": festival_name == "Raksha Bandhan",
                    "independence_day": festival_name == "Independence Day",
                    "weekend": row_date.weekday() >= 5,
                    "day": row_date.day,
                    "week": row_date.isocalendar().week,
                    "month": row_date.month,
                    "quarter": ((row_date.month - 1) // 3) + 1,
                    "year": row_date.year,
                    "day_of_week": row_date.weekday(),
                    "days_since_last_purchase": (
                        (row_date - last_purchase_date).days if last_purchase_date else None
                    ),
                    "seasonal_indicator": season,
                    "weather_score": weather_score,
                })

        engineered_rows = self._add_engineered_features(rows)
        engineered_rows.sort(key=lambda row: (row["date"], row["product"]), reverse=True)
        return DatasetBuildResult(
            rows=engineered_rows,
            duplicate_records_removed=duplicate_records_removed,
            validation_errors=validation_errors,
        )

    def _add_engineered_features(self, rows: list[dict]) -> list[dict]:
        by_product: dict[str, list[dict]] = defaultdict(list)
        for row in rows:
            by_product[row["product"]].append(row)

        for product_rows in by_product.values():
            product_rows.sort(key=lambda row: row["date"])
            for index, row in enumerate(product_rows):
                sales_7 = [r["sales"] for r in product_rows[max(0, index - 6):index + 1]]
                sales_30 = [r["sales"] for r in product_rows[max(0, index - 29):index + 1]]
                previous_sales = product_rows[index - 1]["sales"] if index else 0
                yesterday_sales = previous_sales
                last_7_days_sales = sum(sales_7)
                last_30_days_sales = sum(sales_30)
                row["moving_avg_7"] = round(sum(sales_7) / len(sales_7), 2)
                row["moving_avg_30"] = round(sum(sales_30) / len(sales_30), 2)
                row["yesterday_sales"] = yesterday_sales
                row["last_7_days_sales"] = last_7_days_sales
                row["last_30_days_sales"] = last_30_days_sales
                row["average_daily_sales"] = round(last_30_days_sales / len(sales_30), 2)
                row["sales_growth"] = round(
                    ((row["sales"] - previous_sales) / previous_sales) * 100,
                    2,
                ) if previous_sales else 0.0
                row["inventory_turnover"] = round(sum(sales_30) / max(row["stock"], 1), 4)

        return rows

    def _missing_columns(self, rows: list[dict]) -> list[str]:
        if not rows:
            return DATASET_COLUMNS
        return [
            column for column in DATASET_COLUMNS
            if any(row.get(column) is None and column != "days_since_last_purchase" for row in rows)
        ]

    def _last_training_time(self, rows: list[dict]) -> datetime | None:
        if not rows:
            return None
        latest_date = max(row["date"] for row in rows)
        return datetime.combine(latest_date, datetime.min.time())

    def _match_search_to_product(
        self,
        search: CustomerSearch,
        product_name_to_id: dict[str, int],
    ) -> int | None:
        candidates = [
            search.searched_product,
            search.searched_keyword,
        ]
        for candidate in candidates:
            normalized = (candidate or "").strip().lower()
            if normalized in product_name_to_id:
                return product_name_to_id[normalized]

        keyword = (search.searched_keyword or "").strip().lower()
        for product_name, product_id in product_name_to_id.items():
            if product_name and (product_name in keyword or keyword in product_name):
                return product_id
        return None

    def _to_date(self, value: datetime | None) -> date | None:
        if not value:
            return None
        return value.date()

    def _sort_datetime(self, value: datetime | None) -> datetime:
        if not value:
            return datetime.min
        return value.replace(tzinfo=None)

    def _warehouse_for_product(self, product_id: int) -> str:
        warehouses = ["Warehouse A", "Warehouse B", "Warehouse C"]
        return warehouses[product_id % len(warehouses)]

    def _temperature(self, value: float | None, row_date: date) -> float:
        if value is not None:
            return round(float(value), 2)
        return float(24 + ((row_date.month * 2 + row_date.day) % 15))

    def _humidity(self, row_date: date) -> float:
        return float(45 + ((row_date.day + row_date.month) % 35))

    def _season(self, month: int) -> str:
        if month in {3, 4, 5, 6}:
            return "summer"
        if month in {7, 8, 9}:
            return "monsoon"
        if month in {10, 11}:
            return "festival"
        return "winter"

    def _weather_score(self, temperature: float, humidity: float) -> float:
        comfort = 100 - abs(temperature - 28) * 2 - abs(humidity - 55) * 0.5
        return round(max(0, min(100, comfort)), 2)

    def _festival_name(self, value: str | bool | None) -> str:
        if value is True:
            return "Festival"
        if not value:
            return "None"
        normalized = str(value).strip().lower().replace("_", " ")
        festivals = {
            "diwali": "Diwali",
            "holi": "Holi",
            "christmas": "Christmas",
            "navratri": "Navratri",
            "eid": "Eid",
            "raksha bandhan": "Raksha Bandhan",
            "independence day": "Independence Day",
        }
        return festivals.get(normalized, str(value).strip().title())

    def _weather_type(self, temperature: float, humidity: float, row_date: date) -> str:
        if self._rain(row_date):
            return "Rainy"
        if temperature >= 34:
            return "Hot"
        if humidity >= 70:
            return "Humid"
        return "Clear"

    def _rain(self, row_date: date) -> bool:
        return row_date.month in {7, 8, 9} and row_date.day % 3 == 0

    def _zone(self, city: str, state: str) -> str:
        text = f"{city} {state}".lower()
        if any(name in text for name in ["delhi", "punjab", "haryana", "uttar"]):
            return "North"
        if any(name in text for name in ["pune", "mumbai", "maharashtra", "gujarat"]):
            return "West"
        if any(name in text for name in ["chennai", "bengaluru", "kerala", "telangana"]):
            return "South"
        if any(name in text for name in ["kolkata", "bihar", "odisha", "west bengal"]):
            return "East"
        return "Central"

    def _pincode(self, product_id: int, city: str) -> str:
        seed = sum(ord(char) for char in city) + product_id
        return str(100000 + (seed % 899999))

    def _demand_score(self, searches: int, failed_searches: int, sales: int, stock: int) -> float:
        scarcity_boost = 20 if stock <= 10 else 0
        score = searches * 0.6 + failed_searches * 1.4 + sales * 2 + scarcity_boost
        return min(100, max(0, score))

    def _demand_level(self, score: float) -> str:
        if score >= 75:
            return "HIGH"
        if score >= 40:
            return "MEDIUM"
        return "LOW"


service = AIDatasetService()
