import { Chip, ChipPropsColorOverrides, Icon } from "@/core-components";
import { Dns } from "@mui/icons-material";

export default function AssetTypeChip({
  assetDescription,
}: {
  assetDescription: any;
}) {
  let color: any = "info";

  // switch (assetDescription.assetType) {
  //   case "pc":
  //     color = "primary";
  //     icon = <DesktopMacOutlined />;
  //     break;
  //   case "laptop":
  //     color = "info";
  //     icon = <Laptop />;
  //     break;
  //   case "printer":
  //     color = "success";
  //     icon = <Print />;
  //     break;
  //   case "scanner":
  //     color = "error";
  //     icon = <Scanner />;
  //     break;
  // }
  return (
    <Chip
      icon={
        <Icon className="font-material_icons leading-6">
          {assetDescription.assetIcon}
        </Icon>
      }
      label={assetDescription.assetType}
      color={color}
      variant="outlined"
      className="p-2"
    />
  );
}
