"use client";
import * as React from "react";
import Image from "next/image";
// import ioclRndLogo from "/public/iocl-rnd.png";
// import ioclRndLogoWhite from "/public/iocl-rnd-white.png";
import Link from "next/link";
import { DrawerItem, getDrawerItems } from "@/app/components/Drawer/items";
import { useTheme } from "next-themes";
import {
  Badge,
  CSSObject,
  Skeleton,
  Theme,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Icon,
  styled,
} from "@/core-components";

const drawerWidth = 280;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const MiniDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MyDrawer({
  openDesktop,
  openMobile,
  handleDrawerToggle,
  isSmallScreen,
  items,
}: {
  openDesktop: boolean;
  openMobile: boolean;
  handleDrawerToggle: () => void;
  isSmallScreen: boolean;
  items: any[];
}) {
  const { theme, setTheme } = useTheme();
  // const [items, setItems] = React.useState<Array<DrawerItem>>([]);

  // React.useEffect(() => {
  //   async function fetchDrawerItemsBadgeContents() {
  //     const drawerItems = await getDrawerItems();
  //     const promises = drawerItems.map(async (item) => {
  //       if (typeof item.getBadgeContent === "function") {
  //         return await item.getBadgeContent();
  //       }
  //       return;
  //     });

  //     const values = await Promise.all(promises);

  //     const newItems = drawerItems.map((item, index) => {
  //       for (const key in item) {
  //         if (key === "getBadgeContent") {
  //           delete item[key];
  //         }
  //       }
  //       item.badgeContent = values[index];
  //       return item;
  //     });
  //     setItems(newItems);
  //   }
  // fetchDrawerItemsBadgeContents();
  // }, []);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
  }));
  if (!items.length && !isSmallScreen)
    return (
      <div className={`flex flex-col w-[${drawerWidth}px] gap-4 py-4 `}>
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={48}
            width={drawerWidth}
          />
        ))}
      </div>
    );
  const drawer = (
    <List>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem disablePadding className="block">
            <Link href={item.link}>
              <ListItemButton
              // onClick={isSmallScreen ? handleDrawerToggle : () => null}
              >
                <ListItemIcon className={`mr-6 min-w-0`}>
                  <Badge
                    badgeContent={item.badgeContent}
                    color="error"
                    invisible={!item.badgeContent}
                  >
                    <Icon component={item.icon} />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  // className={`${open ? "opacity-100" : "opacity-0"}`}
                />
              </ListItemButton>
            </Link>
          </ListItem>
          {item.hasDivider && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  if (isSmallScreen) {
    return (
      <MuiDrawer
        variant="temporary"
        open={openMobile}
        onClose={() => {}}
        PaperProps={{
          className: "w-[280px] box-border",
        }}
        // PaperProps={{
        //   className: `w-[${drawerWidth}px] box-border`,
        // }}
      >
        <DrawerHeader className="h-16">
          <Toolbar>
            <Link href="/">
              {/* <Image
                src={theme === "dark" ? ioclRndLogoWhite : ioclRndLogo}
                alt="IOCL R&D Logo"
                height={48}
              /> */}
              <Image
                src={theme === "dark" ? "/iocl-rnd-white.png" : "/iocl-rnd.png"}
                alt="IOCL R&D Logo"
                width={160}
                height={48}
              />
            </Link>
          </Toolbar>
        </DrawerHeader>
        <Divider />
        {drawer}
      </MuiDrawer>
    );
  }

  return (
    <MiniDrawer
      variant="permanent"
      open={openDesktop}
      onMouseEnter={handleDrawerToggle}
      onMouseLeave={handleDrawerToggle}
    >
      <DrawerHeader className="mb-16" />
      {drawer}
    </MiniDrawer>
  );
}
