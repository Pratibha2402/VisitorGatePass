"use client";
import MyDrawer from "@/app/components/Drawer";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { Suspense, useState } from "react";
import { useMediaQuery } from "@/core-components";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

export default function Home({
  children,
  drawerItems,
}: {
  children: React.ReactNode;
  drawerItems: any[];
}) {
  const [openDesktopDrawer, setOpenDesktopDrawer] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  const handleDrawerToggle = () => {
    setOpenDesktopDrawer(!openDesktopDrawer);
    setOpenMobileDrawer(!openMobileDrawer);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <div className="flex min-h-screen flex-col">
        <NavBar
          handleDrawerToggle={handleDrawerToggle}
          isSmallScreen={isSmallScreen}
        />
        {/* <div className="flex flex-1"> */}
        <div className="flex flex-1 overflow-hidden">
          <MyDrawer
            openDesktop={openDesktopDrawer}
            openMobile={openMobileDrawer}
            handleDrawerToggle={handleDrawerToggle}
            isSmallScreen={isSmallScreen}
            items={drawerItems}
          />
          {/* <div className={`flex flex-grow flex-col justify-between`}> */}
          <div className="flex max-h-[calc(100vh-6rem)] flex-grow flex-col justify-between overflow-y-auto">
            <div className="flex flex-1">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
