"use client";

import { handleCondemnAsset } from "@/app/api";
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

export default function CondemnAssetDialog({
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
            await handleCondemnAsset({
              assetId,
            });
            handleClose();
            toast.success("Asset condemned successfully.");
            location.reload();
          } catch (e) {
            console.error(e);
          }
        }),
      }}
    >
      <DialogTitle>Condemn asset </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          To condemn the asset, click condemn.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" loading={formState.isSubmitting}>
          Condemn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
