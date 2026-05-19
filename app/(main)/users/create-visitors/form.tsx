"use client";

import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { submitVisitorRequests } from "../actions";

import {
  normalize,
  isEmpty,
  isValidPhone,
  isValidAge,
  digitsOnly,
} from "./utils/visitorUtils";

import {
  Button,
  FormAutocomplete,
  FormDateRangePicker,
  FormTimeRangePicker,
  FormTextField,
  Typography,
  useForm,
  DataGrid,
  GridColDef,
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
  Box,
} from "@/app/core-components";

import type {
  GridRowParams,
  GridRowModesModel,
  GridRowId,
  GridEventListener,
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

import { VisitorFormValues, VisitorGridRow } from "@/app/type";
import dayjs, { Dayjs } from "dayjs";

const today = dayjs().startOf("day");
const minTime = dayjs().hour(9).minute(0).second(0).millisecond(0); // 9:00 AM
const maxTime = dayjs().hour(16).minute(30).second(0).millisecond(0); // 4:30 PM
const titleOptions = Object.values(TITLE);
const genderOptions = Object.values(GENDER);
const nationalityOptions = Object.values(NATIONALITY);
const vehicleOptions = Object.values(VEHICLENTRY);
const laptopcarryOptions = Object.values(LAPTOPCARRYOPTIONS);
const now = dayjs();
// clamp current time within allowed window
const getClampedStartTime = () => {
  if (now.isBefore(minTime)) return minTime;
  if (now.isAfter(maxTime)) return maxTime;
  return now;
};

const defaultValues: VisitorFormValues = {
  officerEmpno: "",
  officerName: "",
  designation: "",
  department: "",
  intercom: "",
  purpose: "",
  dateRange: [null, null], // ✅ today → today
  timeRange: [null, null],
  // fromdate: null,
  // todate: null,
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

export default function VisitorForm(props: any) {
  const { loggedinUser, approvingAuthority, approvingAuthorityVehicle } = props;

  const {
    control,
    getValues,
    watch,
    trigger,
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
    loggedinUser?.grade || "",
  );
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

    setValue("officerEmpno", loggedinUser.empNo || "");
    setValue("officerName", loggedinUser.name || "");
    setValue("designation", loggedinUser.designation || "");
    setValue("department", loggedinUser.department || "");
  }, [loggedinUser, setValue]);

  /* set value for approving authority based on vehicle entry and approval requirement */
  useEffect(() => {
    if (!loggedinUser) return;

    if (showApprovingAuthority) {
      const selected = getValues("approvingAuthority");

      const isSelectedValid = currentOptions.some(
        (option: any) => option.empNo === selected?.empNo,
      );

      if (!isSelectedValid) {
        setValue("approvingAuthority", null);
      }

      return;
    }

    setValue("approvingAuthority", {
      empNo: loggedinUser.empNo,
      name: loggedinUser.name,
      designation: loggedinUser.designation,
      department: loggedinUser.department,
    });
  }, [
    loggedinUser,
    showApprovingAuthority,
    currentOptions,
    getValues,
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
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
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
    setGridError("");

    const officerFields: (keyof VisitorFormValues)[] = [
      "intercom",
      "purpose",
      "dateRange",
      "timeRange",
      "vehicleentry",
    ];

    if (showApprovingAuthority) {
      officerFields.push("approvingAuthority");
    }

    const isOfficerValid = await trigger(officerFields);
    if (!isOfficerValid) {
      return;
    }

    if (rows.length === 0) {
      setGridError("Add at least one visitor before submitting.");
      return;
    }
    const hasEditingRow = Object.values(rowModesModel).some(
      (rowMode) => rowMode?.mode === GridRowModes.Edit,
    );

    if (hasEditingRow) {
      setGridError("Please save or cancel the row currently being edited.");
      return;
    }

    const formValues = getValues();

    const [startDate, endDate] = formValues.dateRange || [null, null];
    const [startTime, endTime] = formValues.timeRange || [null, null];

    // ✅ CROSS VALIDATION
    if (startDate && endDate && startTime && endTime) {
      const startDateTime = dayjs(startDate)
        .hour(dayjs(startTime).hour())
        .minute(dayjs(startTime).minute());

      const endDateTime = dayjs(endDate)
        .hour(dayjs(endTime).hour())
        .minute(dayjs(endTime).minute());
      if (endDateTime.isBefore(startDateTime)) {
        setGridError("End date & time must be after start date & time");
        return;
      }
    }

    const payload = {
      officerDetails: {
        officerEmpno: formValues.officerEmpno,
        // officerName: formValues.officerName,
        designation: formValues.designation,
        department: formValues.department,
        intercom: formValues.intercom,
        purpose: formValues.purpose,
        fromdate: formValues.dateRange[0]
          ? dayjs(formValues.dateRange[0]).format("YYYY-MM-DD")
          : null,

        todate: formValues.dateRange[1]
          ? dayjs(formValues.dateRange[1]).format("YYYY-MM-DD")
          : null,

        fromtime: formValues.timeRange[0]
          ? dayjs(formValues.timeRange[0]).format("hh:mm A")
          : null,

        totime: formValues.timeRange[1]
          ? dayjs(formValues.timeRange[1]).format("hh:mm A")
          : null,
        vehicleentry: formValues.vehicleentry,
        approvingAuthorityEmpNo: formValues.approvingAuthority?.empNo ?? null,
      },
      visitors: rows,
    };

    const result = await submitVisitorRequests(payload);

    if (!result.success) {
      setGridError(result.message || "Unable to submit visitors.");
      return;
    }

    alert(
      `Visitors submitted successfully. IDs: ${result.visitorIds.join(", ")}`,
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      {/* <Box sx={{ py: 6 }}>
        <Box
          className="mx-auto px-6 bg-white rounded-xl shadow-sm border border-gray-200"
          sx={{ maxWidth: "100%", width: "100%", p: 8 }}
        > */}
      {/* form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-20 max-w-10xl px-6"
      >
        <div className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="space-y-4">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Officer Details
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  alignItems: "start",
                }}
              > */}
              <FormTextField
                name="officerEmpno"
                label="Officer Emp No"
                control={control}
                disabled
                // visible={false}
              />
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

              <FormDateRangePicker
                name="dateRange"
                label="Date Range"
                control={control}
                error={errors.dateRange}
                minDate={dayjs().startOf("day")} // ✅ disables past dates
                rules={{
                  required: "Date range is required",
                  validate: (value: [Dayjs | null, Dayjs | null]) => {
                    const [start, end] = value || [];

                    if (!start || !end) return "Date range is required";

                    if (start.isBefore(today)) {
                      return "Backdate not allowed";
                    }

                    if (end.isBefore(start)) {
                      return "End date must be after start date";
                    }

                    if (end.diff(start, "day") > 1) {
                      return "Maximum 2 days allowed";
                    }

                    return true;
                  },
                }}
              />

              <FormTimeRangePicker
                name="timeRange"
                label="Time Range"
                control={control}
                error={errors.timeRange}
                minTime={dayjs().hour(9).minute(0).second(0).millisecond(0)} // ✅ 9:00 AM
                maxTime={dayjs().hour(16).minute(30).second(0).millisecond(0)} // ✅ 4:30 PM
                rules={{
                  required: "Time range is required",
                  validate: (value: [Dayjs | null, Dayjs | null]) => {
                    const [start, end] = value || [];

                    if (!start || !end) return "Time range is required";

                    if (start.isBefore(minTime) || end.isAfter(maxTime)) {
                      return "Allowed time is 9:00 AM to 4:30 PM";
                    }

                    if (end.isBefore(start)) {
                      return "End time must be after start time";
                    }

                    return true;
                  },
                }}
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
                  rules={{ required: "Approving authority is required" }}
                  error={errors.approvingAuthority}
                  getOptionLabel={(option: any) =>
                    option ? `${option.name} (${option.designation})` : ""
                  }
                  getOptionKey={(option: any) => option.empNo}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option?.empNo === value?.empNo
                  }
                  disableClearable
                />
              )}
              {/* </Box> */}
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Visitor Details
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  alignItems: "start",
                }}
              > */}
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
              {/* </Box> */}
            </div>
          </div>

          {/* <Box sx={{ mt: 4 }}> */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            loading={loading}
            className="w-full md:w-auto "
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
          {/* </Box> */}

          <div className="space-y-3 rounded-xl border border-slate-200 p-4 sm:p-5">
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Added Visitors
            </Typography>
            {gridError && (
              <Typography color="error" sx={{ mb: 1 }}>
                {gridError}
              </Typography>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200">
              {/* <Box sx={{ width: "100%" }}> */}
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
            </div>
            {/* </Box> */}
          </div>

          <div className="flex justify-end">
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleSaveAllVisitors}
              className="w-full md:w-auto"
            >
              Submit All Visitors
            </Button>
          </div>
        </div>
      </form>
      {/* </Box>
      </Box> */}
    </LocalizationProvider>
  );
}
