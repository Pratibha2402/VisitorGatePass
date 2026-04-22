import * as React from "react";
import { Skeleton } from "@mui/material";
import classes from "./styles";

function ThreeRowSkeleton(props: any) {
  return (
    <div>
      <Skeleton
        variant="rectangular"
        animation="pulse"
        height={16}
        width={"100%"}
        sx={classes.skeleton}
        {...props}
      />
      <Skeleton
        variant="rectangular"
        animation="pulse"
        height={16}
        width={"80%"}
        sx={classes.skeleton}
        {...props}
      />
      <Skeleton
        variant="rectangular"
        animation="pulse"
        height={360}
        width={"100%"}
        sx={classes.skeleton}
        {...props}
      />
    </div>
  );
}

export default ThreeRowSkeleton;
