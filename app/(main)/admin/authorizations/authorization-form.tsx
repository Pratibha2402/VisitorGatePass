"use client";

import { useState } from "react";
import {
  Button,
  FormAutocomplete,
  useForm,
  DataGrid,
  GridColDef,
} from "@/app/core-components";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addNormalGatePassApprover,
  addVehicleGatePassApprover,
  deleteNormalGatePassApprover,
  deleteVehicleGatePassApprover,
} from "../actions";
import { searchEmployees } from "../api";
import { useRouter } from "next/navigation";

type FormValues = {
  employee: any | null;
  department: any | null;
  type: "NORMAL" | "VEHICLE";
};

export default function AuthorizationForm({
  departments,
  normalRows,
  vehicleRows,
}: {
  departments: any[];
  normalRows: any[];
  vehicleRows: any[];
}) {
  const router = useRouter();
  const [employeeOptions, setEmployeeOptions] = useState<any[]>([]);

  const {
    control,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      employee: null,
      department: null,
      type: "NORMAL",
    },
  });

  const type = watch("type");

  const normalColumns: GridColDef[] = [
    { field: "rowId", headerName: "ID", width: 90 },
    { field: "hodEmpId", headerName: "Employee No", width: 150 },
    { field: "deptCode", headerName: "Department Code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={async () => {
            const ok = window.confirm("Delete this normal approver?");
            if (!ok) return;

            const result = await deleteNormalGatePassApprover(params.row.rowId);

            if (!result.success) {
              alert(result.message);
              return;
            }

            alert(result.message);
            router.refresh();
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const vehicleColumns: GridColDef[] = [
    { field: "rowId", headerName: "ID", width: 90 },
    { field: "hodEmpId", headerName: "Employee No", width: 150 },
    { field: "deptCode", headerName: "Department Code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={async () => {
            const ok = window.confirm("Delete this vehicle approver?");
            if (!ok) return;

            const result = await deleteVehicleGatePassApprover(
              params.row.rowId,
            );

            if (!result.success) {
              alert(result.message);
              return;
            }

            alert(result.message);
            router.refresh();
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Stack spacing={4}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Add Approver Authorization
      </Typography>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormAutocomplete
          name="type"
          label="Authorization Type"
          control={control}
          options={["NORMAL", "VEHICLE"]}
          getOptionLabel={(option: string) =>
            option === "NORMAL" ? "Normal Gate Pass" : "Vehicle Gate Pass"
          }
          isOptionEqualToValue={(option: string, value: string) =>
            option === value
          }
          disableClearable
        />

        <FormAutocomplete
          name="employee"
          label="Employee"
          control={control}
          options={employeeOptions}
          rules={{ required: "Employee is required" }}
          error={errors.employee}
          getOptionLabel={(option: any) =>
            option ? `${option.name} (${option.empNo})` : ""
          }
          isOptionEqualToValue={(option: any, value: any) =>
            option?.empNo === value?.empNo
          }
          onInputChange={async (_event: any, value: string) => {
            if (value.length < 3) return;
            const rows = await searchEmployees(value);
            setEmployeeOptions(rows);
          }}
        />

        <FormAutocomplete
          name="department"
          label="Department"
          control={control}
          options={departments}
          rules={{ required: "Department is required" }}
          error={errors.department}
          getOptionLabel={(option: any) =>
            option ? `${option.department} (${option.deptCode})` : ""
          }
          isOptionEqualToValue={(option: any, value: any) =>
            option?.deptCode === value?.deptCode
          }
        />
      </div>

      <Button
        variant="contained"
        onClick={async () => {
          const valid = await trigger(["employee", "department"]);

          if (!valid) return;

          const values = getValues();

          const payload = {
            empNo: Number(values.employee.empNo),
            deptCode: values.department.deptCode,
          };

          const result =
            type === "VEHICLE"
              ? await addVehicleGatePassApprover(payload)
              : await addNormalGatePassApprover(payload);

          if (!result.success) {
            alert(result.message);
            return;
          }

          alert(result.message);
          router.refresh();
        }}
      >
        Add Authorization
      </Button>

      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Normal Gate Pass Approvers
        </Typography>

        <DataGrid
          rows={normalRows}
          columns={normalColumns}
          getRowId={(row) => row.rowId}
          disableRowSelectionOnClick
        />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Vehicle Gate Pass Approvers
        </Typography>

        <DataGrid
          rows={vehicleRows}
          columns={vehicleColumns}
          getRowId={(row) => row.rowId}
          disableRowSelectionOnClick
        />
      </Stack>
    </Stack>
  );
}
