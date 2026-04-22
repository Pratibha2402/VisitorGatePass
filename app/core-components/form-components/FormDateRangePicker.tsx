import * as React from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { Controller } from "react-hook-form";

function FormDateRangePicker(props: any) {
  const { name, control, error, rules, ...dateRangePickerProps } = props;
  let errorMessage = error?.message || "";
  if (error?.type === "required" && !error?.message) {
    errorMessage = "This field is required!";
  }
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }: any) => {
        const { value, onChange, onBlur, ref, ...restFields } = field;
        return (
          <div style={{ display: "flex", flexFlow: "column" }}>
            <DateRangePicker
              {...restFields}
              value={value}
              onChange={(value: any) => onChange(value)}
              {...dateRangePickerProps}
              error={!!error}
              helperText={errorMessage}
              closeOnSelect
            />
            {error && errorMessage && (
              <div
                style={{
                  marginLeft: 8,
                  marginTop: 4,
                  fontSize: 12,
                  color: "#d32f2f",
                }}
              >
                {errorMessage}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export default FormDateRangePicker;
