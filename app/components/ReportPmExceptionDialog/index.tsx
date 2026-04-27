"use client";

import { handleAllocateToUser } from "@/app/api";
import {
  handleCompletePm,
  postPmException,
} from "@/app/(main)/preventive-maintenance/api";
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

interface PmException {
  id: string;
  label: string;
}

const pmExceptionOptions = [
  {
    id: "movedToSpares",
    label: "Asset moved to spares",
  },
  {
    id: "condemned",
    label: "Asset condemned",
  },
  {
    id: "otpNotShared",
    label: "OTP not shared",
  },
  {
    id: "userUnavailable",
    label: "User unavailable",
  },
];

export default function ReportPmExceptionDialog({
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
  } = useForm<{ pmException: PmException | null }>({
    defaultValues: { pmException: null },
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(async (data) => {
          try {
            await postPmException({ ...data, assetPm });
            reset();
            handleClose();
            toast.success(
              `Exception reported for asset ${assetPm.Asset.assetId}`
            );
          } catch (e: any) {
            reset();
            console.error(e?.message);
            toast.error(e?.message);
          }
        }),
      }}
    >
      <DialogTitle>Report PM Exception</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          Please select the appropriate reason for the exception for the PM of
          asset <span className="font-bold">{assetPm?.assetId}</span>.
        </DialogContentText>
        <FormAutocomplete
          name="pmException"
          label="Exception"
          options={pmExceptionOptions}
          isOptionEqualToValue={(option: any, value: any) =>
            option.id === value.id
          }
          control={control}
          error={errors["pmException"]}
          rules={{
            required: true,
          }}
          autoFocus
        />
      </DialogContent>
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
          Report Exception
        </Button>
      </DialogActions>
    </Dialog>
  );
}
