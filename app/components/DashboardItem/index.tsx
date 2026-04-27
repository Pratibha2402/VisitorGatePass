import { Paper, SvgIcon } from "@mui/material";
import Link from "next/link";

export default function DashboardItem({
  title,
  icon,
  link,
}: {
  title: string;
  icon: typeof SvgIcon;
  link: string;
}) {
  return (
    <Link href={link}>
      <Paper
        elevation={3}
        className="flex items-center justify-center gap-4 p-16 text-2xl font-bold hover:bg-primary hover:text-white"
      >
        <SvgIcon component={icon} fontSize="large" />
        {title}
      </Paper>
    </Link>
  );
}
