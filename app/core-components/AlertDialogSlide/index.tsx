"use client";
import { forwardRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import type { ReactElement, ReactNode } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  title: string;
  desc: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
  children?: ReactNode;
  open: boolean;
  submitting?: boolean;
};

export default function AlertDialogSlide(props: Props) {
  return (
    <>
      <Dialog
        open={props.open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={props.onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ paddingBottom: 0 }}>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.desc}
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ marginTop: 4 }}
            component={"div"}
          >
            {props.children}
          </DialogContentText>
        </DialogContent>
        {(props.onSubmit || props.onClose) && (
          <DialogActions>
            {props.onClose && (
              <LoadingButton
                onClick={props.onClose}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </LoadingButton>
            )}
            {props.onSubmit && (
              <LoadingButton
                onClick={props.onSubmit}
                variant="contained"
                loading={props?.submitting}
              >
                Submit
              </LoadingButton>
            )}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
