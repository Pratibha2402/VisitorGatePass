/** @jsxImportSource @emotion/react */

import { Button, IconButton } from "@mui/material";
import classes from "./styles";
import messages from "./messages";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const VALID_FILE_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".xls",
  ".xlsx",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
];

function SingleFileUpload(props: any) {
  const {
    selectedFile,
    handleUploadFile,
    onRemoveFile,
    uploading,
    uploadedPath,
    onRemoveUploadedFile,
  } = props;

  if (uploadedPath) {
    return (
      <div css={classes.container}>
        <div css={classes.wrapper}>
          <div css={classes.fileList}>
            <div css={classes.wrap}>
              <div css={classes.fileName}>{uploadedPath.split("/").pop()}</div>
              <IconButton
                aria-label="delete"
                color="primary"
                css={classes.deleteIcon}
                onClick={() => onRemoveUploadedFile()}
                disabled={uploading}
              >
                <HighlightOffIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div css={classes.container}>
      <div css={classes.wrapper}>
        {!selectedFile?.name ? (
          <div css={classes.dropzone}>
            <Button
              variant="outlined"
              component="label"
              css={classes.uploadButton}
              startIcon={<CloudUploadIcon />}
            >
              {props?.label || messages.upload}
              <input
                hidden
                // multiple
                type="file"
                accept={VALID_FILE_EXTENSIONS.join(",")}
                onChange={(e: any) => {
                  handleUploadFile(e.target.files[0]);
                }}
              />
            </Button>
          </div>
        ) : (
          <div css={classes.fileList}>
            <div css={classes.wrap}>
              <div css={classes.fileName}>{selectedFile.name}</div>
              <IconButton
                aria-label="delete"
                color="primary"
                css={classes.deleteIcon}
                onClick={() => onRemoveFile()}
                disabled={uploading}
              >
                <HighlightOffIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleFileUpload;
