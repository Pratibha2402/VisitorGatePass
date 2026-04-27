"use client";

import { handleMoveToSpares } from "@/app/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useForm,
} from "@/core-components";
import { toast } from "sonner";

export default function MoveToSparesDialog({
  open,
  handleClose,
  assetId,
}: {
  open: boolean;
  handleClose: () => void;
  assetId: string;
}) {
  const {
    control,
    formState: { errors },
    formState,
    handleSubmit,
  } = useForm<{}>({
    defaultValues: {},
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(async (data) => {
          try {
            await handleMoveToSpares({
              assetId,
            });
            handleClose();
            toast.success("Asset moved to spares successfully.");
            location.reload();
          } catch (e) {
            console.error(e);
          }
        }),
      }}
    >
      <DialogTitle>Move asset to spares</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          To move the asset to spares, click move.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" loading={formState.isSubmitting}>
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}
