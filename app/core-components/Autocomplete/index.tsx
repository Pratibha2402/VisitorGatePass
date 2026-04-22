/** @jsxImportSource @emotion/react */

/**
 *
 * Autocomplete Component
 *
 */
import {
  AutocompleteProps,
  ChipTypeMap,
  Autocomplete as MuiAutocomplete,
} from "@mui/material";
import type { OutlinedInputProps } from "@mui/material/OutlinedInput";
import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "../TextField";
import React from "react";

function Autocomplete<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
>(
  props: AutocompleteProps<
    Value,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  > & {
    label: React.ReactNode;
    helperText?: React.ReactNode;
    warning?: string;
    error?: boolean;
    textFieldInputProps?: Partial<OutlinedInputProps>;
  },
) {
  const {
    label,
    error = false,
    helperText = "",
    sx = {},
    textFieldInputProps = {},
    ...restAutocompleteProps
  } = props;

  return (
    <MuiAutocomplete
      {...restAutocompleteProps}
      renderInput={(params) => {
        const mergedSlotProps: TextFieldProps["slotProps"] = {
          ...params.slotProps,
          input: {
            ...(params.slotProps?.input ?? {}),
            ...textFieldInputProps,
          },
        };

        return (
          <TextField
            {...params}
            label={label}
            error={error}
            helperText={helperText}
            slotProps={mergedSlotProps}
          />
        );
      }}
      sx={{ flex: "1 1 0", ...sx }}
    />
  );
}

export default Autocomplete;
