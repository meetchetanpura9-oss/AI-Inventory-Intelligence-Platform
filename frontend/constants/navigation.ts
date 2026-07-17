import {
  BarChart3,
  Boxes,
  ClipboardList,
  DatabaseZap,
  BrainCircuit,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  User,
  Users,
  CloudSun,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";
import {
  ANALYTICS_ROLES,
  DEMAND_INTELLIGENCE_ROLES,
  PRODUCT_WRITE_ROLES,
  PURCHASE_WRITE_ROLES,
  ROLES,
  SALES_WRITE_ROLES,
  SETTINGS_ROLES,
  USER_MANAGEMENT_ROLES,
  type Role,
} from "./roles";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  { title: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.STAFF, ROLES.VIEWER] },
  { title: "Products", href: ROUTES.products, icon: Package, roles: PRODUCT_WRITE_ROLES },
  { title: "Inventory", href: ROUTES.inventory, icon: Boxes, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.STAFF, ROLES.VIEWER] },
  { title: "Transactions", href: ROUTES.transactions, icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.STAFF, ROLES.VIEWER] },
  { title: "Sales", href: ROUTES.sales, icon: ShoppingCart, roles: SALES_WRITE_ROLES },
  { title: "Purchases", href: ROUTES.purchases, icon: Receipt, roles: PURCHASE_WRITE_ROLES },
  { title: "Analytics", href: ROUTES.analytics, icon: BarChart3, roles: ANALYTICS_ROLES },
  { title: "AI Dataset", href: ROUTES.ai, icon: DatabaseZap, roles: ANALYTICS_ROLES },
  { title: "AI Forecast", href: ROUTES.aiForecast, icon: BrainCircuit, roles: ANALYTICS_ROLES },
  { title: "Demand Intelligence", href: ROUTES.demandIntelligence, icon: BrainCircuit, roles: DEMAND_INTELLIGENCE_ROLES },
  { title: "Weather Intelligence", href: ROUTES.weatherIntelligence, icon: CloudSun, roles: DEMAND_INTELLIGENCE_ROLES },
  { title: "Festival Intelligence", href: ROUTES.festivalIntelligence, icon: Sparkles, roles: DEMAND_INTELLIGENCE_ROLES },
  { title: "Users", href: ROUTES.users, icon: Users, roles: USER_MANAGEMENT_ROLES },
  { title: "Settings", href: ROUTES.settings, icon: Settings, roles: SETTINGS_ROLES },
  { title: "Profile", href: ROUTES.profile, icon: User, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.STAFF, ROLES.VIEWER] },
];

export const canAccessNavigationItem = (role: Role | undefined, item: NavigationItem) =>
  Boolean(role && item.roles.includes(role));

export const canAccessPath = (role: Role | undefined, pathname: string) => {
  if (!role) {
    return false;
  }

  const matchedItem = navigationItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  if (!matchedItem) {
    return true;
  }

  return matchedItem.roles.includes(role);
};
