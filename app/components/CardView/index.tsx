import { Chip } from "@mui/material";
import Icon from "@mui/material/Icon";
import Link from "next/link";
import { ElementType } from "react";

export default function CardView({
  title,
  link,
  icon,
  showChip,
  chipLabel,
  iconColor,
  description,
}: {
  title: string;
  link: string;
  icon: ElementType;
  showChip?: boolean;
  chipLabel?: number | string | undefined;
  iconColor?: string;
  description?: string;
}) {
  return (
    <Link
      href={link}
      className={`m-16 flex basis-full flex-col items-center justify-center gap-2 rounded-xl bg-paper p-16 text-lg font-bold shadow-lg hover:bg-primary hover:bg-gradient-to-br hover:text-white hover:shadow-2xl dark:bg-paper-dark `}
    >
      <Icon component={icon} style={{ color: iconColor }} />
      <div className="flex items-center gap-2 text-center">
        <span>{title}</span>
        {showChip && <Chip color="error" size="small" label={chipLabel} />}
      </div>
      <div className="text-sm text-blue-700">{description}</div>
    </Link>
  );
}
