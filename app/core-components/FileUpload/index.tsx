import { Button, IconButton, SingleFileUpload } from "@/core-components";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function FileUpload(props: any) {
  const { label, onAdd, onFileUpload, onRemoveUploadedFile } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState("");
  return (
    <div className="flex w-full justify-between">
      <SingleFileUpload
        selectedFile={selectedFile}
        handleUploadFile={(selectedFile: any) => {
          setSelectedFile(selectedFile);
        }}
        onRemoveFile={() => setSelectedFile(null)}
        onRemoveUploadedFile={() => {
          setUploadedPath("");
          onRemoveUploadedFile();
        }}
        label={label}
        uploading={uploading}
        uploadedPath={uploadedPath}
      />
      {selectedFile ? (
        <Button
          color="primary"
          size="large"
          variant="contained"
          startIcon={<AddCircleIcon />}
          style={{ marginLeft: 8 }}
          loading={uploading}
          onClick={async () => {
            setUploading(true);
            const finalUploadedPath = await onAdd(selectedFile);
            setUploadedPath(finalUploadedPath);
            setSelectedFile(null);
            setUploading(false);
            onFileUpload(finalUploadedPath);
          }}
        >
          ADD
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
