import * as React from "react";
import TextField from "../TextField";
import { Controller } from "react-hook-form";

const invalidStringMessage = "Please do not use special characters!";
const invalidStringFormat = /[`{};'"|<>~]/;

function FormTextField(props: any) {
  const {
    name,
    control,
    defaultValue,
    rules,
    disabled,
    error,
    helperText,
    ...restTextFieldProps
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
      rules={{
        ...rules,
        validate: {
          ...rules?.validate,
          validInput: (input: string) =>
            input
              ? !invalidStringFormat.test(input) || invalidStringMessage
              : true,
        },
      }}
      render={({ field }) => {
        return (
          <TextField
            {...restTextFieldProps}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            disabled={field.disabled}
            name={field.name}
            inputRef={field.ref}
            error={!!error}
            helperText={error ? errorMessage : helperText}
          />
        );
      }}
    />
  );
}

export default FormTextField;
