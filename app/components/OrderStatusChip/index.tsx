import { PRINTER_COMPONENTS_ORDER_STATUSES } from "@/enums";
import { Chip } from "@mui/material";

export default function OrderStatusChip({
  status,
}: {
  status: keyof typeof PRINTER_COMPONENTS_ORDER_STATUSES;
}) {
  let color = "default";
  switch (status) {
    case "pending": {
      color = "warning";
      break;
    }
    case "approved": {
      color = "info";
      break;
    }
    case "rejected": {
      color = "error";
      break;
    }
    case "partiallyCompleted": {
      color = "info";
      break;
    }
    case "completed": {
      color = "success";
      break;
    }
  }
  return (
    <Chip
      color={color as any}
      label={PRINTER_COMPONENTS_ORDER_STATUSES[status] as any}
    />
  );
}
