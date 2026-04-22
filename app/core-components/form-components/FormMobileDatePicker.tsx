import * as React from "react";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

function FormMobileDatePicker(props: any) {
  const {
    name,
    control,
    defaultValue,
    rules,
    disabled,
    error,
    variant,
    ...datePickerProps
  } = props;
  let errorMessage = error?.message || "";
  if (error?.type === "required" && !error?.message) {
    errorMessage = "This field is required!";
  }
  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        disabled={disabled}
        rules={rules}
        render={({ field }: any) => {
          return (
            <MobileDatePicker
              {...datePickerProps}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              disabled={field.disabled}
              name={field.name}
              sx={{ flex: "1 1 0", minWidth: 360, ...props.sx }}
              slotProps={{
                ...datePickerProps.slotProps,
                textField: {
                  ...datePickerProps.slotProps?.textField,
                  helperText: errorMessage,
                  error: error,
                },
              }}
            />
          );
        }}
      />
    </div>
  );
}

export default FormMobileDatePicker;
