import * as React from "react";
import FileUpload from "@/core-components/FileUpload";
import { Controller } from "react-hook-form";

function FormFileUpload(props: any) {
  const { name, control, rules, error, ...fileUploadProps } = props;
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
          <div style={{ display: "flex", flexFlow: "column" }}>
            <FileUpload
              {...restFields}
              value={value}
              onFileUpload={(uploadedPath: any) => onChange(uploadedPath)}
              onRemoveUploadedFile={() => onChange("")}
              {...fileUploadProps}
              error={!!error}
              helperText={errorMessage}
            />
            {error && errorMessage && (
              <div
                style={{
                  marginLeft: 8,
                  marginTop: 4,
                  fontSize: 12,
                  color: "#d32f2f",
                }}
              >
                {errorMessage}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export default FormFileUpload;
