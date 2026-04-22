"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider, createTheme } from "@mui/material";
import { roboto } from "./fonts";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const rootElement = window.document.getElementById("__next");

  const muiTheme = createTheme({
    palette: {
      ...(resolvedTheme === "light"
        ? {
            mode: "light",
            background: {
              default: "#f8fafc",
              paper: "#ffffff",
            },
            primary: {
              main: "#ea580c",
            },
            secondary: {
              main: "#312e81",
            },
          }
        : {
            mode: "dark",
            background: {
              default: "#0f172a",
              paper: "#1e293b",
            },
            primary: {
              main: "#ea580c",
            },
            secondary: {
              main: "#312e81",
            },
          }),
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiDialog: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
  });

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
