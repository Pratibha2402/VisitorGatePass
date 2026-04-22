import Checkbox from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";

export default function FormCheckbox(props: any) {
  const { name, control, rules, onChange, ...restCheckboxProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Checkbox
          name={field.name}
          onChange={(event) => {
            field.onChange(event);
            if (typeof onChange === "function") onChange(event);
          }}
          checked={field.value}
          disabled={field.disabled}
          inputRef={field.ref}
          {...restCheckboxProps}
        />
      )}
    />
  );
}
