import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

function FormDateTimePicker(props: any) {
  const {
    name,
    control,
    error,
    rules,
    disablePast = true,
    ...dateTimePickerProps
  } = props;
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
          <DateTimePicker
            {...restFields}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            value={value}
            onChange={(value: any) => onChange(value)}
            {...dateTimePickerProps}
            disablePast={disablePast}
            sx={{ width: "100%", ...props.sx }}
            // error={!!error}
            // helperText={errorMessage}
          />
        );
      }}
    />
  );
}

export default FormDateTimePicker;
