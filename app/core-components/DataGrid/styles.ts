import { css } from "@emotion/react";

const classes = {
  container: (theme: any) =>
    css({
      label: "container",
      width: "100%",
    }),
  wrapper: css({
    label: "wrapper",
  }),
  margin: {
    margin: 8,
  },
  grid: {
    marginTop: 64,
    marginBottom: 128, // to:do
  },
};
export default classes;
