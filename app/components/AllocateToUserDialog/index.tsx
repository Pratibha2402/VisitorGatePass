"use client";

import { handleAllocateToUser } from "@/app/api";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormAutocomplete,
  FormTextField,
  useForm,
} from "@/core-components";
import { AccountCircle } from "@mui/icons-material";
import { toast } from "sonner";

export default function AllocateToUserDialog({
  open,
  handleClose,
  assetId,
  allocatedToUser,
  employees,
}: {
  open: boolean;
  handleClose: () => void;
  assetId: string;
  allocatedToUser?: string;
  employees: Array<any>;
}) {
  const {
    control,
    formState: { errors },
    formState,
    handleSubmit,
  } = useForm<{ user: any; remarks: string; location: string }>({
    defaultValues: { user: null, remarks: "", location: "" },
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(async (data) => {
          try {
            await handleAllocateToUser({
              assetId,
              username: data.user.username,
              remarks: data.remarks,
              location: data.location,
            });
            handleClose();
            toast.success("Asset allocated to user successfully.");
            location.reload();
          } catch (e) {
            console.error(e);
          }
        }),
      }}
    >
      <DialogTitle>Allocate asset to a user</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <DialogContentText>
          To allocate this asset to a user, please select the user here.
        </DialogContentText>
        <FormAutocomplete
          name="user"
          label="User"
          control={control}
          options={employees.filter(
            (value: any) => value.username !== allocatedToUser
          )}
          renderOption={(props: any, option: any) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <div className="flex items-center gap-2">
                  <AccountCircle />
                  <div className="flex items-center gap-2">
                    <div>{option.name}</div>•
                    <Chip label={option.department} size="small" />
                  </div>
                </div>
              </li>
            );
          }}
          autoFocus
          fullWidth
          rules={{ required: true }}
          getOptionLabel={(option: any) =>
            `${option.name} [${option.username}]`
          }
          isOptionEqualToValue={(option: any, value: any) =>
            option.username === value.username
          }
          error={errors["user"]}
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
