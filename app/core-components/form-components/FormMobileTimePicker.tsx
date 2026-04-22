import * as React from "react";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

function FormMobileTimePicker(props: any) {
  const { name, control, error, rules, ...mobileTimePickerProps } = props;
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
          <MobileTimePicker
            {...restFields}
            value={value}
            onChange={(value: any) => onChange(value)}
            {...mobileTimePickerProps}
            sx={{ width: "100%", ...props.sx }}
            orientation="landscape"
            // error={!!error}
            // helperText={errorMessage}
          />
        );
      }}
    />
  );
}

export default FormMobileTimePicker;
