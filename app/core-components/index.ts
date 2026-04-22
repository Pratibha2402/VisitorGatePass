"use client";

import BackgroundLetterAvatars from "./BackgroundLetterAvatar";
import SingleFileUpload from "./SingleFileUpload";
import ThreeRowSkeleton from "./ThreeRowSkeleton";
import { LoadingButton as Button } from "@mui/lab";

export * from "@mui/material";
export * from "./Theme";

import Autocomplete from "./Autocomplete";
import TextField from "./TextField";
// import DataGrid, {
//   GridToolbar,
//   GridToolbarContainer,
//   GridToolbarColumnsButton,
//   GridToolbarFilterButton,
//   GridToolbarExport,
//   GridToolbarDensitySelector,
// } from "./DataGrid";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import FormAutocomplete from "./form-components/FormAutocomplete";
import FormTextField from "./form-components/FormTextField";
import FormDatePicker from "./form-components/FormDatePicker";
import FormDateRangePicker from "./form-components/FormDateRangePicker";
import FormSwitch from "./form-components/FormSwitch";
// import SingleFileUpload from "./SingleFileUpload";
// import ThreeRowSkeleton from "./ThreeRowSkeleton";
// import FormMobileTimePicker from "./form-components/FormMobileTimePicker";
import FormDateTimePicker from "./form-components/FormDateTimePicker";
import FormMobileDatePicker from "./form-components/FormMobileDatePicker";
// import FormFileUpload from "./form-components/FormFileUpload";

export {
  Autocomplete,
  TextField,
  Button,
  //   DataGrid,
  // GridToolbar,
  useForm,
  useWatch,
  useFieldArray,
  FormAutocomplete,
  FormTextField,
  // FormFileUpload,
  FormDatePicker,
  FormMobileDatePicker,
  FormDateRangePicker,
  SingleFileUpload,
  // GridToolbarContainer,
  // GridToolbarColumnsButton,
  // GridToolbarFilterButton,
  // GridToolbarExport,
  // GridToolbarDensitySelector,
  FormSwitch,
  ThreeRowSkeleton,
  // FormMobileTimePicker,
  FormDateTimePicker,
  BackgroundLetterAvatars,
};

// export { DataGrid, GridToolbar } from "@mui/x-data-grid";
// export type { GridColDef, GridRowsProp } from "./DataGrid";
// export {
//   DatePicker,
//   MobileTimePicker,
//   DateTimePicker,
//   DateRangePicker,
// } from "@mui/x-date-pickers";
// export { LoadingButton as Button } from "@mui/lab";
// export { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
// export { Chip as SquareChip } from "@mui/material-next/Chip";
