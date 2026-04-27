"use client";

import { handleAllocateToUser } from "@/app/api";
import { handleCompletePm } from "@/app/(main)/preventive-maintenance/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormAutocomplete,
  FormTextField,
  useForm,
} from "@/core-components";
import { revalidatePath } from "next/cache";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EnterPmCompletionCodeDialog({
  open,
  handleClose,
  assetPm,
}: {
  open: boolean;
  handleClose: () => void;
  assetPm: any;
}) {
  const {
    control,
    formState: { errors },
    formState,
    handleSubmit,
    reset,
  } = useForm<{ pmCompletionCode: string }>({
    defaultValues: { pmCompletionCode: "" },
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(async (data) => {
          try {
            await handleCompletePm({ ...data, pm: assetPm });
            reset();
            handleClose();
            toast.success(`PM completed for asset ${assetPm.Asset.assetId}`);
          } catch (e: any) {
            reset();
            console.error(e?.message);
            toast.error(e?.message);
          }
        }),
      }}
    >
      <DialogTitle>Enter PM Completion Code</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          To complete the preventive maintenance for the asset{" "}
          <span className="font-bold">{assetPm?.Asset.assetId}</span>, please
          enter PM Completion Code shared to user.
        </DialogContentText>
        <FormTextField
          name="pmCompletionCode"
          label="PM Completion Code"
          control={control}
          error={errors["pmCompletionCode"]}
          rules={{
            required: true,
            minLength: {
              value: 4,
              message: "PM Completion Code must have four digits.",
            },
            maxLength: {
              value: 4,
              message: "PM Completion Code must have four digits.",
            },
          }}
          type="number"
          autoFocus
        />
      </DialogContent>
      <div className="px-6 text-sm">
        Please use &apos;0000&apos; for Director&apos;s Secretariat assets.
      </div>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            reset();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={formState.isSubmitting}
          variant="contained"
        >
          Complete PM
        </Button>
      </DialogActions>
    </Dialog>
  );
}
