from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.inventory import Inventory
from app.models.sale import Sale
from app.models.purchase import Purchase
from app.customer_search.models import CustomerSearch
from app.demand.models import ProductDemand
from app.demand.repository import repository
from app.demand.schemas import ProductDemandCalculateResponse


class DemandService:

    def calculate_demand_score(
        self,
        search_count: int,
        failed_searches: int,
        sales_count: int,
        current_stock: int
    ) -> float:
        return float((search_count * 2) + (failed_searches * 5) + (sales_count * 3) - (current_stock * 1))

    def determine_demand_level(self, score: float) -> str:
        if score <= 50:
            return "LOW"
        elif score <= 120:
            return "MEDIUM"
        else:
            return "HIGH"

    def calculate_all_demands(self, db: Session) -> ProductDemandCalculateResponse:
        # Fetch all products
        products = db.query(Product).all()
        if not products:
            # If no products, clear and return
            repository.clear_demands(db)
            return ProductDemandCalculateResponse(status="success", records_calculated=0)

        # Fetch current stock
        inventories = db.query(Inventory).all()
        stock_map = {inv.product_id: inv.quantity for inv in inventories}

        # Fetch sales quantities
        sales = db.query(Sale.product_id, func.sum(Sale.quantity)).group_by(Sale.product_id).all()
        sales_map = {s[0]: s[1] for s in sales}

        # Fetch purchases quantities
        purchases = db.query(Purchase.product_id, func.sum(Purchase.quantity)).group_by(Purchase.product_id).all()
        purchases_map = {p[0]: p[1] for p in purchases}

        # Fetch successful searches (grouped by product name, city, area)
        successful_searches = (
            db.query(
                CustomerSearch.searched_product,
                CustomerSearch.city,
                CustomerSearch.area,
                func.count(CustomerSearch.id).label("count")
            )
            .filter(CustomerSearch.found == True)
            .group_by(CustomerSearch.searched_product, CustomerSearch.city, CustomerSearch.area)
            .all()
        )

        # Fetch failed searches (keyword, city, area)
        failed_searches = (
            db.query(
                CustomerSearch.searched_keyword,
                CustomerSearch.city,
                CustomerSearch.area
            )
            .filter(CustomerSearch.found == False)
            .all()
        )

        # Build location-based search indices
        # successful searches: product_name -> (city, area) -> count
        succ_search_map = {}
        for r in successful_searches:
            pname = r.searched_product
            city = r.city
            area = r.area
            cnt = r.count
            if pname not in succ_search_map:
                succ_search_map[pname] = {}
            succ_search_map[pname][(city, area)] = cnt

        # Find distinct locations
        locations = set()
        for r in successful_searches:
            locations.add((r.city, r.area))
        for fs in failed_searches:
            locations.add((fs.city, fs.area))

        # We will hold all records to save
        demands_to_save = []

        # Iterate over all products
        for product in products:
            p_id = product.id
            p_name = product.product_name
            p_name_lower = p_name.lower()

            stock = stock_map.get(p_id, 0)
            sales_cnt = int(sales_map.get(p_id, 0) or 0)
            purchases_cnt = int(purchases_map.get(p_id, 0) or 0)

            # 1. Calculate GLOBAL metrics
            # Global successful searches: sum over all locations
            global_search_cnt = 0
            if p_name in succ_search_map:
                global_search_cnt = sum(succ_search_map[p_name].values())

            # Global failed searches: keyword matches product_name case-insensitively
            global_failed_cnt = sum(
                1 for fs in failed_searches
                if fs.searched_keyword.lower() in p_name_lower
            )

            global_score = self.calculate_demand_score(
                search_count=global_search_cnt,
                failed_searches=global_failed_cnt,
                sales_count=sales_cnt,
                current_stock=stock
            )
            global_level = self.determine_demand_level(global_score)

            # Create global demand record
            global_demand = ProductDemand(
                product_id=p_id,
                city=None,
                area=None,
                search_count=global_search_cnt,
                failed_searches=global_failed_cnt,
                sales_count=sales_cnt,
                purchase_count=purchases_cnt,
                current_stock=stock,
                demand_score=global_score,
                demand_level=global_level
            )
            demands_to_save.append(global_demand)

            # 2. Calculate LOCALIZED metrics
            for loc in locations:
                loc_city, loc_area = loc
                
                # Local successful searches
                loc_search_cnt = 0
                if p_name in succ_search_map:
                    loc_search_cnt = succ_search_map[p_name].get((loc_city, loc_area), 0)

                # Local failed searches
                loc_failed_cnt = sum(
                    1 for fs in failed_searches
                    if fs.city == loc_city and fs.area == loc_area and fs.searched_keyword.lower() in p_name_lower
                )

                # Only create localized demand records if there is active search interest in that location
                if loc_search_cnt > 0 or loc_failed_cnt > 0:
                    loc_score = self.calculate_demand_score(
                        search_count=loc_search_cnt,
                        failed_searches=loc_failed_cnt,
                        sales_count=sales_cnt,
                        current_stock=stock
                    )
                    loc_level = self.determine_demand_level(loc_score)

                    local_demand = ProductDemand(
                        product_id=p_id,
                        city=loc_city,
                        area=loc_area,
                        search_count=loc_search_cnt,
                        failed_searches=loc_failed_cnt,
                        sales_count=sales_cnt,
                        purchase_count=purchases_cnt,
                        current_stock=stock,
                        demand_score=loc_score,
                        demand_level=loc_level
                    )
                    demands_to_save.append(local_demand)

        # Clear and save all calculated demands in a single transaction
        repository.clear_demands(db)
        repository.save_demands(db, demands_to_save)

        return ProductDemandCalculateResponse(
            status="success",
            records_calculated=len(demands_to_save)
        )

    def get_all_demands(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        return repository.get_all_demands(db, city, area)

    def get_high_demand_products(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        return repository.get_high_demand_products(db, city, area)

    def get_low_demand_products(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        return repository.get_low_demand_products(db, city, area)

    def get_product_demand(
        self,
        db: Session,
        product_id: int,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> Optional[ProductDemand]:
        return repository.get_product_demand(db, product_id, city, area)


service = DemandService()
