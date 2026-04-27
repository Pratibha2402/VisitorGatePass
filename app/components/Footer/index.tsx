import { Code } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className=" flex flex-none items-center justify-center bg-paper  p-4 text-sm shadow-[0_0_6px_-1px_rgb(0_0_0_/_0.1)] dark:bg-paper-dark ">
      <Code />
      <span className="mx-2">by R&D IS Department</span>
    </footer>
  );
}
