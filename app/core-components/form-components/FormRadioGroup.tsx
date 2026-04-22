import * as React from "react";
import TextField from "../TextField";
import { Controller } from "react-hook-form";
import { FormControlLabel, FormLabel, RadioGroup } from "@/core-components";

function FormRadioGroup(props: any) {
  const {
    children,
    name,
    label,
    control,
    rules,
    disabled,
    ...restRadioGroupProps
  } = props;
  return (
    <div className="">
      <FormLabel>{label}</FormLabel>
      <Controller
        render={({ field }) => (
          <RadioGroup aria-label={name} {...field}>
            {children}
          </RadioGroup>
        )}
        name={name}
        control={control}
      />
    </div>
  );
}

export default FormRadioGroup;
