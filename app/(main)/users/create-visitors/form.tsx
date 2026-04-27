"use client";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Box,
  Button,
  FormAutocomplete,
  FormDateTimePicker,
  FormTextField,
  Typography,
  useForm,
  DataGrid,
  GridColDef,
  GridRowModes,
  type GridRowParams,
  type GridRowModesModel,
  type GridRowId,
  GridActionsCellItem,
  type GridEventListener,
  GridRowEditStopReasons,
} from "@/app/core-components";
import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import {
  TITLE,
  GENDER,
  NATIONALITY,
  VEHICLENTRY,
  LAPTOPCARRYOPTIONS,
} from "@/app/enum";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  type ApprovingAuthority,
  type Employee,
  type VehicleApprovingAuthority,
} from "@/app/database/data";

import { VisitorFormValues, VisitorGridRow } from "@/app/type";

type VisitorFormProps = {
  loggedinUser: Employee | null;
  approvingAuthority: ApprovingAuthority[] | null;
  approvingAuthorityVehicle: VehicleApprovingAuthority[] | null;
  // allActiveRndEmployees: Employee[] | null;
};

const titleOptions = Object.values(TITLE);
const genderOptions = Object.values(GENDER);
const nationalityOptions = Object.values(NATIONALITY);
const vehicleOptions = Object.values(VEHICLENTRY);
const laptopcarryOptions = Object.values(LAPTOPCARRYOPTIONS);
const defaultValues: VisitorFormValues = {
  officerName: "",
  designation: "",
  department: "",
  intercom: "",
  purpose: "",
  fromdate: null,
  todate: null,
  vehicleentry: "No",
  laptopcarry: "No",

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
  approvingAuthorityVehicle,
}: VisitorFormProps) {
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<VisitorFormValues>({
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [gridError, setGridError] = useState("");

  const [rows, setRows] = useState<VisitorGridRow[]>([]);

  const isVehicleEntry = watch("vehicleentry");

  const requiresManualApproval = ["A", "B", "C"].includes(
    loggedinUser?.GRADE || "",
  );
  // const isAutoApproval = isVehicleEntry === "No" && !requiresManualApproval;
  const showApprovingAuthority =
    isVehicleEntry === "Yes" || requiresManualApproval;

  const currentApprovingAuthorities = useMemo(
    () => approvingAuthority ?? [],
    [approvingAuthority],
  );
  const vehicleApprovingAuthorities = useMemo(
    () => approvingAuthorityVehicle ?? [],
    [approvingAuthorityVehicle],
  );
  const currentOptions =
    isVehicleEntry === "Yes"
      ? vehicleApprovingAuthorities
      : requiresManualApproval
        ? currentApprovingAuthorities
        : [];

  /* set value for logged in user details on form load */
  useEffect(() => {
    if (!loggedinUser) return;

    setValue("officerName", loggedinUser.NAME || "");
    setValue("designation", loggedinUser.DESIG || "");
    setValue("department", loggedinUser.DEPT || "");
  }, [loggedinUser, setValue]);

  /* set value for approving authority based on vehicle entry and approval requirement */
  useEffect(() => {
    if (!loggedinUser) {
      return;
    }

    if (isVehicleEntry === "Yes") {
      setValue("approvingAuthority", null);
      return;
    }

    if (requiresManualApproval) {
      setValue("approvingAuthority", null);
      return;
    }

    setValue("approvingAuthority", {
      EMPNO: loggedinUser.EMPNO,
      NAME: loggedinUser.NAME,
      DESIG: loggedinUser.DESIG,
      DEPT: loggedinUser.DEPT,
    });

    //setValue("approvingAuthority", currentApprovingAuthorities[0] || null);
  }, [
    isVehicleEntry,
    loggedinUser,
    requiresManualApproval,
    vehicleApprovingAuthorities,
    setValue,
  ]);

  const buildVisitorRow = (
    data: VisitorFormValues,
    id: number,
  ): VisitorGridRow => ({
    id,
    company: data.company,
    title: data.title,
    name: data.name,
    address1: data.address1,
    address2: data.address2,
    age: data.age,
    phone: data.phone,
    gender: data.gender,
    nationality: data.nationality,
    laptopcarry: data.laptopcarry,
  });

  const normalize = (value: string) => value.trim().toLowerCase();
  const isEmpty = (value: unknown) => String(value ?? "").trim() === "";
  const isValidPhone = (value: unknown) =>
    /^\d{10}$/.test(String(value ?? "").trim());
  const isValidAge = (value: unknown) => {
    const text = String(value ?? "").trim();
    if (!/^\d+$/.test(text)) return false;

    const age = Number(text);
    return age >= 1 && age <= 120;
  };

  const digitsOnly = (value: unknown) =>
    String(value ?? "").replace(/\D+/g, "");

  const isDuplicateVisitor = (data: VisitorFormValues) => {
    return rows.some((row) => {
      return (
        normalize(row.name) === normalize(data.name) &&
        normalize(row.phone) === normalize(data.phone) &&
        normalize(row.company) === normalize(data.company)
      );
    });
  };

  const onSubmit = async (data: VisitorFormValues) => {
    if (isDuplicateVisitor(data)) {
      alert("This visitor is already added.");
      return;
    }
    setLoading(true);
    setGridError("");

    const newId =
      rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1;

    const newRow = buildVisitorRow(data, newId);

    setRows((prev) => [...prev, newRow]);

    setValue("title", titleOptions[0]);
    setValue("name", "");
    setValue("address1", "");
    setValue("address2", "");
    setValue("age", "");
    setValue("phone", "");
    setValue("gender", genderOptions[0]);
    setValue("nationality", nationalityOptions[0]);
    setValue("laptopcarry", "No");

    setLoading(false);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id: GridRowId) => {
    setGridError("");
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };
  const handleSaveClick = (id: GridRowId) => {
    setGridError("");
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  };
  const handleCancelClick = (id: GridRowId) => {
    setGridError("");
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const handleDeleteRow = (id: number) => {
    setGridError("");
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleProcessRowUpdate = (newRow: VisitorGridRow) => {
    if (isEmpty(newRow.company)) {
      throw new Error("Visitor company is required");
    }

    if (isEmpty(newRow.name)) {
      throw new Error("Visitor name is required");
    }

    if (isEmpty(newRow.address1)) {
      throw new Error("Address Line 1 is required");
    }

    if (!isValidPhone(newRow.phone)) {
      throw new Error("Contact number must be exactly 10 digits");
    }

    if (!isValidAge(newRow.age)) {
      throw new Error("Age must be a valid number between 1 and 120");
    }

    const duplicateExists = rows.some((row) => {
      if (row.id === newRow.id) return false;

      return (
        normalize(row.name) === normalize(newRow.name) &&
        normalize(row.phone) === normalize(newRow.phone) &&
        normalize(row.company) === normalize(newRow.company)
      );
    });

    if (duplicateExists) {
      throw new Error("This visitor is already added.");
    }

    setGridError("");
    setRows((prev) => prev.map((row) => (row.id === newRow.id ? newRow : row)));

    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "title",
      headerName: "Title",
      width: 100,
      type: "singleSelect",
      valueOptions: titleOptions,
      editable: true,
    },
    {
      field: "name",
      headerName: "Visitor Name",
      flex: 1,
      minWidth: 180,
      editable: true,
    },

    {
      field: "address1",
      headerName: "Address 1",
      flex: 1,
      minWidth: 180,
      editable: true,
    },
    {
      field: "address2",
      headerName: "Address 2",
      flex: 1,
      minWidth: 180,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      width: 90,
      editable: true,
      valueParser: (value: string) => digitsOnly(value).slice(0, 3),
    },

    {
      field: "phone",
      headerName: "Phone",
      width: 140,
      editable: true,
      valueParser: (value: string) => digitsOnly(value).slice(0, 10),
    },

    {
      field: "gender",
      headerName: "Gender",
      width: 120,
      type: "singleSelect",
      valueOptions: genderOptions,
      editable: true,
    },

    {
      field: "nationality",
      headerName: "Nationality",
      width: 140,
      type: "singleSelect",
      valueOptions: nationalityOptions,
      editable: true,
    },
    {
      field: "laptopcarry",
      headerName: "Laptop Carry",
      width: 140,
      type: "singleSelect",
      valueOptions: laptopcarryOptions,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 140,
      getActions: ({ id }: GridRowParams) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveClick(id)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CloseIcon />}
              label="Cancel"
              onClick={() => handleCancelClick(id)}
              showInMenu={false}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(id)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(Number(id))}
            showInMenu={false}
          />,
        ];
      },
    },
  ];

  const handleSaveAllVisitors = async () => {
    const formValues = getValues();
    const payload = {
      officerDetails: {
        officerName: formValues.officerName,
        designation: formValues.designation,
        department: formValues.department,
        intercom: formValues.intercom,
        purpose: formValues.purpose,
        fromdate: formValues.fromdate,
        todate: formValues.todate,
        vehicleentry: formValues.vehicleentry,
        approvingAuthority: formValues.approvingAuthority,
      },
      visitors: rows,
    };

    console.log("Visitor request payload:", payload);
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
                rules={{
                  required: "Intercom number is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Intercom must contain digits only",
                  },
                }}
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
                options={vehicleOptions}
                getOptionLabel={(option: string) => option}
                isOptionEqualToValue={(option: string, value: string | null) =>
                  option === value
                }
                disableClearable
              />

              {showApprovingAuthority && (
                <FormAutocomplete
                  name="approvingAuthority"
                  label="Approving Authority"
                  control={control}
                  options={currentOptions}
                  rules={{ required: true }}
                  error={errors.approvingAuthority}
                  getOptionLabel={(
                    option: ApprovingAuthority | Employee | null,
                  ) => (option ? `${option.NAME} (${option.DESIG})` : "")}
                  isOptionEqualToValue={(
                    option: ApprovingAuthority | Employee,
                    value: ApprovingAuthority | Employee | null,
                  ) => option.EMPNO === value?.EMPNO}
                  disableClearable
                />
              )}
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
                rules={{
                  required: "Age is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Age must contain digits only",
                  },
                  validate: (value: string) => {
                    const age = Number(value);
                    if (age < 1) return "Age must be greater than 0";
                    if (age > 120) return "Age must be 120 or less";
                    return true;
                  },
                }}
                error={errors.age}
              />

              <FormTextField
                name="phone"
                label="Contact Number"
                control={control}
                rules={{
                  required: "Contact number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Contact number must be exactly 10 digits",
                  },
                }}
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

              <FormAutocomplete
                name="laptopcarry"
                label="Is Visitor Carrying Laptop?"
                control={control}
                options={laptopcarryOptions}
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
              "Add Visitor"
            )}
          </Button>

          <div className="mt-8">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Added Visitors
            </Typography>
            {gridError && (
              <Typography color="error" sx={{ mb: 1 }}>
                {gridError}
              </Typography>
            )}

            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={(error) =>
                  setGridError(error.message || "Unable to save row")
                }
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
              />
            </Box>
          </div>

          <Button
            variant="contained"
            color="success"
            onClick={handleSaveAllVisitors}
          >
            Submit All Visitors
          </Button>
        </div>
      </form>
    </LocalizationProvider>
  );
}
