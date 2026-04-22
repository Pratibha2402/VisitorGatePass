/** @jsxImportSource @emotion/react */
/**
 *
 * TextField Component
 *
 */
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

function TextField(props: TextFieldProps) {
  const {
    size = "medium",
    variant = "outlined",
    sx = {},
    ...restTextFieldProps
  } = props;
  return (
    <MuiTextField
      {...restTextFieldProps}
      size={size}
      variant={variant}
      sx={{ flex: "1 1 0", minWidth: 360, ...sx }}
    />
  );
}

export default TextField;
