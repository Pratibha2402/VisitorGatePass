"use client";

import * as React from "react";
import { TimeRangePicker } from "@mui/x-date-pickers-pro";
import { Controller } from "react-hook-form";

function FormTimeRangePicker(props: any) {
  const { name, control, error, rules, ...timeRangePickerProps } = props;

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
        const { value, onChange, ...restFields } = field;

        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TimeRangePicker
              {...restFields}
              value={value}
              onChange={(value: any) => onChange(value)}
              {...timeRangePickerProps}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                },
              }}
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

export default FormTimeRangePicker;
