"use client";

import { handleAllocateToDept } from "@/app/api";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AllocateToDeptDialog({
  open,
  handleClose,
  assetId,
  allocatedToDept,
  departments,
}: {
  open: boolean;
  handleClose: () => void;
  assetId: string;
  allocatedToDept?: string;
  departments: Array<any>;
}) {
  const {
    control,
    formState: { errors },
    formState,
    handleSubmit,
  } = useForm<{ department: any; remarks: string; location: string }>({
    defaultValues: { department: null, remarks: "", location: "" },
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(async (data) => {
          try {
            await handleAllocateToDept({
              assetId,
              department: data.department.departmentCodeUnique,
              remarks: data.remarks,
              location: data.location,
            });
            handleClose();
            toast.success("Asset allocated to department successfully.");
            location.reload();
          } catch (e) {
            console.error(e);
          }
        }),
      }}
    >
      <DialogTitle>Allocate asset to a department</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          To allocate this asset to a department, please select the department
          here.
        </DialogContentText>
        <FormAutocomplete
          name="department"
          label="Department"
          control={control}
          options={departments.filter(
            (value: any) => value.departmentCodeUnique !== allocatedToDept
          )}
          autoFocus
          fullWidth
          rules={{ required: true }}
          getOptionLabel={(option: any) => `${option.department}`}
          isOptionEqualToValue={(option: any, value: any) =>
            option.departmentCodeUnique === value.departmentCodeUnique
          }
          error={errors["department"]}
        />
        <FormTextField name="remarks" label="Remarks" control={control} />
        <FormTextField name="location" label="Location" control={control} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" loading={formState.isSubmitting}>
          Allocate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
