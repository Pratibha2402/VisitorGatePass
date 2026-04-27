import { Chip, ChipPropsColorOverrides, Icon } from "@/core-components";
import { AMC_STATUSES } from "@/enums";
import {
  Cancel,
  CheckCircle,
  DeleteForever,
  Dns,
  Verified,
} from "@mui/icons-material";

export default function AssetTypeChip({
  amcStatus,
}: {
  amcStatus: keyof typeof AMC_STATUSES;
}) {
  let color: any = "info";
  let icon: any;

  switch (amcStatus) {
    case "inWarranty":
      color = "success";
      icon = <Verified />;
      break;
    case "inAMC":
      color = "info";
      icon = <CheckCircle />;
      break;
    case "outOfAMC":
      color = "warning";
      icon = <Cancel />;
      break;
    case "condemned":
      color = "error";
      icon = <DeleteForever />;
      break;
  }
  return (
    <Chip
      icon={<Icon className="font-material_icons leading-6">{icon}</Icon>}
      label={AMC_STATUSES[amcStatus]}
      color={color}
      variant="outlined"
      className="p-2"
    />
  );
}
