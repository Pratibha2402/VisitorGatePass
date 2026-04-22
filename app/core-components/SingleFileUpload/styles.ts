import { css } from "@emotion/react";

const classes = {
  container: (theme: any) =>
    css({
      label: "singleFileUploadContainer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      // minWidth: 380,
      width: "100%",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      boxShadow: theme.shadows[1],
      backgroundColor: theme.palette.secondary.main,
    }),
  wrapper: {
    width: "100%",
    padding: 2,
  },
  dropzone: {},
  uploadButton: (theme: any) =>
    css({
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      "&:hover": {
        backgroundColor: theme.palette.background.paper,
      },
    }),
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 8px",
  },
  fileName: (theme: any) =>
    css({
      color: theme.palette.primary.main,
      flexWrap: "wrap",
      ...theme.typography.subtitle1,
    }),
  fileList: {
    marginTop: 1,
  },
  deleteIcon: (theme: any) =>
    css({
      marginLeft: 1,
      color: theme.palette.error.light,
      cursor: "pointer",
      height: "16px",
    }),
};

export default classes;
