import { Icon } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

export default function Page({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: SvgIconComponent;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="flex justify-center gap-2 text-3xl font-semibold">
        {icon && <Icon fontSize="large" component={icon} />}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
