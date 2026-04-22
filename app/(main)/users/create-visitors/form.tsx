"use client";

import {
  Box,
  Button,
  FormAutocomplete,
  FormDateTimePicker,
  FormTextField,
  Typography,
  useForm,
} from "@/app/core-components";
import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { TITLE, GENDER, NATIONALITY } from "@/app/enum";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type ApprovingAuthority, type Employee } from "@/app/database/data";

type VisitorFormProps = {
  loggedinUser: Employee | null;
  approvingAuthority: ApprovingAuthority[] | null;
  allActiveRndEmployees: Employee[] | null;
};

type VisitorFormValues = {
  officerName: string;
  designation: string;
  department: string;
  intercom: string;
  purpose: string;
  fromdate: Date | null;
  todate: Date | null;
  vehicleentry: string;
  approvingAuthority: ApprovingAuthority | null;
  company: string;
  title: string;
  name: string;
  address1: string;
  address2: string;
  age: string;
  phone: string;
  gender: string;
  nationality: string;
};

const titleOptions = Object.values(TITLE);
const genderOptions = Object.values(GENDER);
const nationalityOptions = Object.values(NATIONALITY);

const defaultValues: VisitorFormValues = {
  officerName: "",
  designation: "",
  department: "",
  intercom: "",
  purpose: "",
  fromdate: null,
  todate: null,
  vehicleentry: "No",
  approvingAuthority: null,
  company: "",
  title: titleOptions[0],
  name: "",
  address1: "",
  address2: "",
  age: "",
  phone: "",
  gender: genderOptions[0],
  nationality: nationalityOptions[0],
};

export default function VisitorForm({
  loggedinUser,
  approvingAuthority,
  allActiveRndEmployees,
}: VisitorFormProps) {
  const {
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<VisitorFormValues>({
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const isVehicleEntry = watch("vehicleentry");
  const currentApprovingAuthorities = useMemo(
    () => approvingAuthority ?? [],
    [approvingAuthority],
  );
  const currentActiveEmployees = useMemo(
    () => allActiveRndEmployees ?? [],
    [allActiveRndEmployees],
  );
  const currentOptions =
    isVehicleEntry === "Yes"
      ? currentActiveEmployees
      : currentApprovingAuthorities;

  useEffect(() => {
    if (!loggedinUser) {
      return;
    }

    reset({
      ...defaultValues,
      officerName: loggedinUser.NAME || "",
      designation: loggedinUser.DESIG || "",
      department: loggedinUser.DEPT || "",
    });
  }, [loggedinUser, reset]);

  useEffect(() => {
    if (isVehicleEntry === "Yes") {
      const employee = currentActiveEmployees[0];

      if (employee) {
        setValue("approvingAuthority", {
          EMPNO: employee.EMPNO,
          NAME: employee.NAME,
          DESIG: employee.DESIG,
          DEPT: employee.DEPT,
        });
      } else {
        setValue("approvingAuthority", null);
      }

      return;
    }

    setValue("approvingAuthority", currentApprovingAuthorities[0] || null);
  }, [
    isVehicleEntry,
    currentApprovingAuthorities,
    currentActiveEmployees,
    setValue,
  ]);

  const onSubmit = async (data: VisitorFormValues) => {
    setLoading(true);
    console.log("Form Data:", data);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-[1120px]"
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Officer Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                alignItems: "start",
              }}
            >
              <FormTextField
                name="officerName"
                label="Officer Name"
                control={control}
                disabled
              />
              <FormTextField
                name="designation"
                label="Designation"
                control={control}
                disabled
              />
              <FormTextField
                name="department"
                label="Department"
                control={control}
                disabled
              />
              <FormTextField
                name="intercom"
                label="Intercom No"
                control={control}
                rules={{ required: true }}
                error={errors.intercom}
              />
              <FormDateTimePicker
                name="fromdate"
                label="From Date"
                control={control}
              />
              <FormDateTimePicker
                name="todate"
                label="To Date"
                control={control}
              />
              <FormTextField
                name="purpose"
                label="Purpose of Visit"
                control={control}
                rules={{ required: true }}
                error={errors.purpose}
              />
              <FormAutocomplete
                name="vehicleentry"
                label="Vehicle Entry Required?"
                control={control}
                options={["Yes", "No"]}
                getOptionLabel={(option: string) => option}
                isOptionEqualToValue={(option: string, value: string | null) =>
                  option === value
                }
                disableClearable
              />
              <FormAutocomplete
                name="approvingAuthority"
                label="Approving Authority"
                control={control}
                options={currentOptions}
                getOptionLabel={(option: ApprovingAuthority | Employee | null) =>
                  option ? `${option.NAME} (${option.DESIG})` : ""
                }
                isOptionEqualToValue={(
                  option: ApprovingAuthority | Employee,
                  value: ApprovingAuthority | Employee | null,
                ) => option.EMPNO === value?.EMPNO}
                disableClearable
              />
            </Box>
          </div>

          <div className="flex flex-col gap-10">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Visitor Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                alignItems: "start",
              }}
            >
              <FormTextField
                name="company"
                label="Visitor Company"
                control={control}
                rules={{ required: true }}
                error={errors.company}
              />

              <FormAutocomplete
                name="title"
                label="Title"
                control={control}
                options={titleOptions}
                getOptionLabel={(option: string) => option}
                isOptionEqualToValue={(option: string, value: string | null) =>
                  option === value
                }
                disableClearable
              />

              <FormTextField
                name="name"
                label="Visitor Name"
                control={control}
                rules={{ required: true }}
                error={errors.name}
              />

              <FormTextField
                name="address1"
                label="Address Line 1"
                control={control}
                rules={{ required: true }}
                error={errors.address1}
              />

              <FormTextField
                name="address2"
                label="Address Line 2"
                control={control}
              />

              <FormTextField
                name="age"
                label="Age"
                control={control}
                rules={{ required: true }}
                error={errors.age}
              />

              <FormTextField
                name="phone"
                label="Contact Number"
                control={control}
                rules={{ required: true }}
                error={errors.phone}
              />

              <FormAutocomplete
                name="gender"
                label="Gender"
                control={control}
                options={genderOptions}
                getOptionLabel={(option: string) => option}
                isOptionEqualToValue={(option: string, value: string | null) =>
                  option === value
                }
                disableClearable
              />

              <FormAutocomplete
                name="nationality"
                label="Nationality"
                control={control}
                options={nationalityOptions}
                getOptionLabel={(option: string) => option}
                isOptionEqualToValue={(option: string, value: string | null) =>
                  option === value
                }
                disableClearable
              />
            </Box>
          </div>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            loading={loading}
            sx={{
              color: "grey.50",
              textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            {loading ? (
              <Stack spacing={2} direction="row">
                <CircularProgress color="inherit" size={24} />
              </Stack>
            ) : (
              "Submit Visitor"
            )}
          </Button>
        </div>
      </form>
    </LocalizationProvider>
  );
}
