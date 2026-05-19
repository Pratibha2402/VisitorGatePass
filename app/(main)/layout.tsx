import { getDrawerItems } from "../components/Drawer/items";
import Home from "./home";

async function fetchDrawerItemsBadgeContents() {
  const drawerItems = await getDrawerItems();
  const promises = drawerItems.map(async (item) => {
    if (typeof item.getBadgeContent === "function") {
      return await item.getBadgeContent();
    }
    return;
  });

  const values = await Promise.all(promises);

  return drawerItems.map((item, index) => {
    for (const key in item) {
      if (key === "getBadgeContent") {
        delete item[key];
      }
    }
    item.badgeContent = values[index];
    return item;
  });
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = await fetchDrawerItemsBadgeContents();
  return <Home drawerItems={items}>{children}</Home>;
}
