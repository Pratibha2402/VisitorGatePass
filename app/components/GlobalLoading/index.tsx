import { CircularProgress } from "@mui/material";

export default function GlobalLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <CircularProgress />
    </div>
  );
}
