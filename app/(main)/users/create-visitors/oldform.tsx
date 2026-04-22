"use client";

import { GENDER, TITLE, NATIONALITY } from "@/app/enum";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";

type VisitorFormState = {
  officer: string;
  designation: string;
  department: string;
  intercom: string;
  fromDateTime: Dayjs;
  toDateTime: Dayjs;
  vehicle: boolean;
  approvingAuthority: string;
  purpose: string;
  company: string;
  title: string;
  name: string;
  address1: string;
  address2: string;
  age: string;
  phone: string;
  gender: string;
  nationality: string;
  laptop: boolean;
  idProofName: string;
};

const titleOptions = Object.values(TITLE);
const genderOptions = Object.values(GENDER);
const nationalityOptions = Object.values(NATIONALITY);
const mergeDate = (currentValue: Dayjs, nextDate: Dayjs | null) => {
  if (!nextDate) {
    return currentValue;
  }

  return currentValue
    .year(nextDate.year())
    .month(nextDate.month())
    .date(nextDate.date());
};

const mergeTime = (currentValue: Dayjs, nextTime: Dayjs | null) => {
  if (!nextTime) {
    return currentValue;
  }

  return currentValue
    .hour(nextTime.hour())
    .minute(nextTime.minute())
    .second(nextTime.second());
};

export default function CreateVisitorForm() {
  const [form, setForm] = useState<VisitorFormState>({
    officer: "",
    designation: "",
    department: "",
    intercom: "",
    fromDateTime: dayjs(),
    toDateTime: dayjs().add(1, "hour"),
    vehicle: false,
    approvingAuthority: "Pratibha Choudhary",
    purpose: "",
    company: "",
    title: TITLE.mr,
    name: "",
    address1: "",
    address2: "",
    age: "",
    phone: "",
    gender: GENDER.male,
    nationality: nationalityOptions[0],
    laptop: false,
    idProofName: "",
  });

  const handleFieldChange = <K extends keyof VisitorFormState>(
    key: K,
    value: VisitorFormState[K],
  ) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Box component="form" noValidate>
          <Typography variant="h6">Officer to be Visited</Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={form.officer}
                onChange={(event) =>
                  handleFieldChange("officer", event.target.value)
                }
              ></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Designation"
                value={form.designation}
                onChange={(event) =>
                  handleFieldChange("designation", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Department"
                value={form.department}
                onChange={(event) =>
                  handleFieldChange("department", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Intercom No"
                value={form.intercom}
                onChange={(event) =>
                  handleFieldChange("intercom", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="From Date"
                value={form.fromDateTime}
                onChange={(value) =>
                  handleFieldChange(
                    "fromDateTime",
                    mergeDate(form.fromDateTime, value),
                  )
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TimePicker
                label="From Time"
                value={form.fromDateTime}
                onChange={(value) =>
                  handleFieldChange(
                    "fromDateTime",
                    mergeTime(form.fromDateTime, value),
                  )
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="To Date"
                value={form.toDateTime}
                onChange={(value) =>
                  handleFieldChange(
                    "toDateTime",
                    mergeDate(form.toDateTime, value),
                  )
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TimePicker
                label="To Time"
                value={form.toDateTime}
                onChange={(value) =>
                  handleFieldChange(
                    "toDateTime",
                    mergeTime(form.toDateTime, value),
                  )
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.vehicle}
                    onChange={(event) =>
                      handleFieldChange("vehicle", event.target.checked)
                    }
                  />
                }
                label="Vehicle Entry Required"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Approving Authority"
                value={form.approvingAuthority}
                onChange={(event) =>
                  handleFieldChange("approvingAuthority", event.target.value)
                }
              >
                <MenuItem value="Pratibha Choudhary">
                  Pratibha Choudhary
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Purpose"
                value={form.purpose}
                onChange={(event) =>
                  handleFieldChange("purpose", event.target.value)
                }
              />
            </Grid>
          </Grid>

          <Typography variant="h6">Visitor&apos;s Details</Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Visitor Company"
                value={form.company}
                onChange={(event) =>
                  handleFieldChange("company", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Title"
                value={form.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
              >
                {titleOptions.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                label="Name"
                value={form.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Address 1"
                value={form.address1}
                onChange={(event) =>
                  handleFieldChange("address1", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Address 2"
                value={form.address2}
                onChange={(event) =>
                  handleFieldChange("address2", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Age"
                value={form.age}
                onChange={(event) =>
                  handleFieldChange("age", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Contact No"
                value={form.phone}
                onChange={(event) =>
                  handleFieldChange("phone", event.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={form.gender}
                onChange={(event) =>
                  handleFieldChange("gender", event.target.value)
                }
              >
                {genderOptions.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Nationality"
                value={form.nationality}
                onChange={(event) =>
                  handleFieldChange("nationality", event.target.value)
                }
              >
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" component="label">
                Upload ID Proof
                <input
                  hidden
                  type="file"
                  onChange={(event) =>
                    handleFieldChange(
                      "idProofName",
                      event.target.files?.[0]?.name ?? "",
                    )
                  }
                />
              </Button>

              {form.idProofName ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Selected file: {form.idProofName}
                </Typography>
              ) : null}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.laptop}
                    onChange={(event) =>
                      handleFieldChange("laptop", event.target.checked)
                    }
                  />
                }
                label="Visitor carrying Laptop"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button type="submit" variant="contained" color="success">
              Add Visitor
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
