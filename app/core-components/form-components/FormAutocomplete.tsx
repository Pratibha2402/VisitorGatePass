import * as React from "react";
import Autocomplete from "@/core-components/Autocomplete";
import { Controller } from "react-hook-form";

function FormAutocomplete(props: any) {
  const {
    name,
    control,
    defaultValue,
    rules,
    disabled,
    error,
    helperText,
    onChange,
    ...restAutoCompleteProps
  } = props;
  let errorMessage = error?.message || "";
  if (error?.type === "required" && !error?.message) {
    errorMessage = "This field is required!";
  }
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      render={({ field }) => {
        return (
          <Autocomplete
            {...restAutoCompleteProps}
            onChange={(event, value) => {
              field.onChange(value);
              if (typeof onChange === "function") onChange(event, value);
            }}
            onBlur={field.onBlur}
            value={field.value}
            disabled={field.disabled}
            name={field.name}
            error={!!error}
            helperText={!!error ? errorMessage : helperText}
          />
        );
      }}
    />
  );
}

export default FormAutocomplete;
