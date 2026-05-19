"use client";
import * as React from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@/core-components";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout, Login, LightMode, DarkMode } from "@mui/icons-material";
import Image from "next/image";
// import ioclRndLogo from "/public/iocl-rnd.png";
// import ioclRndLogoWhite from "/public/iocl-rnd-white.png";
import Link from "next/link";
import BackgroundLetterAvatars from "@/core-components/BackgroundLetterAvatar";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { NAVBAR_TITLE } from "@/app/constants";
import { useSession } from "@/app/context/session-provider";

export default function NavBar({
  handleDrawerToggle,
  isSmallScreen,
}: {
  handleDrawerToggle: () => void;
  isSmallScreen: boolean;
}) {
  const session = useSession();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const { resolvedTheme: theme, setTheme } = useTheme();
  const router = useRouter();

  const open = Boolean(anchorElUser);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    if (process.env.NEXT_PUBLIC_CENTRAL_SIGNOUT_URL) {
      router.push(process.env.NEXT_PUBLIC_CENTRAL_SIGNOUT_URL);
    }
    handleCloseUserMenu();
  };
  const handleLogin = () => {
    handleCloseUserMenu();
  };
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <div
      className={`sticky left-0 top-0 z-50 flex flex-none basis-24 items-center justify-between gap-x-2 overflow-hidden bg-paper p-2 shadow-md sm:z-[1300] dark:bg-paper-dark`}
    >
      <div className="flex flex-none items-center">
        <div className="flex items-center justify-center px-4">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={() => {
              handleDrawerToggle();
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        {!isSmallScreen && (
          <Link href="https://rndapps.indianoil.in">
            <Image
              src={theme === "dark" ? "/iocl-rnd-white.png" : "/iocl-rnd.png"}
              alt="IOCL R&D Logo"
              width={160}
              height={48}
            />
          </Link>
        )}
      </div>

      <div className="hover:dark:cyan-red-400 whitespace-nowrap bg-gradient-to-b from-cyan-500 to-violet-700 bg-clip-text font-poppins text-3xl font-bold text-transparent hover:from-cyan-600 hover:to-violet-800 dark:from-cyan-200 dark:to-violet-200 dark:hover:from-cyan-200 dark:hover:to-violet-300">
        <Link href="/">{NAVBAR_TITLE}</Link>
      </div>

      <Tooltip title="Account settings">
        <IconButton
          onClick={handleOpenUserMenu}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <BackgroundLetterAvatars
            name={session?.user?.name}
            height={isSmallScreen ? 32 : 48}
            width={isSmallScreen ? 32 : 48}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElUser}
        id="account-menu"
        open={open}
        onClose={handleCloseUserMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {session ? (
          <div>
            <div className="mx-2 mt-1 text-center text-sm">
              {session.user?.name}
            </div>
            <div className="mx-2 mb-2 text-center text-sm">{`${
              session.user?.designation || "NA"
            } (${session?.user?.username})`}</div>
            <Divider />
          </div>
        ) : (
          <div></div>
        )}
        <MenuItem onClick={toggleTheme}>
          {theme === "light" ? (
            <>
              <ListItemIcon>
                <DarkMode fontSize="small" />
              </ListItemIcon>
              Dark Mode
            </>
          ) : (
            <>
              <ListItemIcon>
                <LightMode fontSize="small" />
              </ListItemIcon>
              Light Mode
            </>
          )}
        </MenuItem>
        <MenuItem onClick={session ? handleLogout : handleLogin}>
          <ListItemIcon>
            {session ? <Logout fontSize="small" /> : <Login fontSize="small" />}
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
