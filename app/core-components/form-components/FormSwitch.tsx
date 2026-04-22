import * as React from "react";
import { Switch } from "@mui/material";
import { Controller } from "react-hook-form";
import ErrorIcon from "@mui/icons-material/Error";

function FormSwitch(props: any) {
  const { name, control, rules, error, label, ...switchProps } = props;
  let errorMessage = error?.message || "";
  if (error?.type === "required" && !error?.message) {
    errorMessage = "Please, confirm this field!";
  }
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }: any) => {
        const { value, onChange, ...restFields } = field;
        return (
          <div style={{ display: "flex", flexFlow: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Switch
                {...restFields}
                checked={value}
                onChange={(event: any) => onChange(event.target.checked)}
                {...switchProps}
                // error={!!error}
                // helperText={errorMessage}
              />
              {label && (
                <div
                  style={{ display: "flex", flexFlow: "column", marginLeft: 8 }}
                >
                  <div style={{ fontSize: "smaller", fontWeight: "bold" }}>
                    {label}
                  </div>
                  {error && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <ErrorIcon color="error" fontSize="small" />
                      <div
                        style={{
                          fontSize: "smaller",
                          fontWeight: "bold",
                          color: "#d32f2f",
                          marginLeft: 8,
                        }}
                      >
                        {errorMessage}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}

export default FormSwitch;
