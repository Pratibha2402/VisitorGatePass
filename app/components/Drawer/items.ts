import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/enums";
import {
  AddCircle,
  AddLink,
  AddShoppingCart,
  Assessment,
  PendingActions,
  SvgIconComponent,
  CalendarMonth,
  NoteAdd,
  History,
  InventoryOutlined,
  Dvr,
  AddToQueue,
  CleaningServices,
} from "@mui/icons-material";

export interface DrawerItem {
  name: string;
  icon: SvgIconComponent;
  link: string;
  getBadgeContent?: Function;
  badgeContent?: string | number;
  hasDivider?: boolean;
}

export async function getDrawerItems() {
  let drawerItems: Array<DrawerItem> = [];

  const isAmcAdmin = await hasRole([
    USER_ROLES.IT_HARDWARE_AMC_EIC,
    USER_ROLES.IT_HARDWARE_AMC_SIC,
  ]);
  const isAmcEngineer = await hasRole([
    USER_ROLES.IT_HARDWARE_AMC_ENGINEER,
    USER_ROLES.IT_HARDWARE_AMC_TL,
  ]);
  if (isAmcAdmin || isAmcEngineer) {
    drawerItems = [
      ...drawerItems,
      {
        name: "Asset models list",
        icon: Dvr,
        link: "/asset-model",
      },
      {
        name: "Assets list",
        icon: Dvr,
        link: "/asset",
      },
      {
        name: "Add an asset model",
        icon: AddToQueue,
        link: "/asset-model/add",
      },
      {
        name: "Add an asset",
        icon: AddToQueue,
        link: "/asset/add",
      },
      {
        name: "Add a printer consumable",
        icon: AddCircle,
        link: "/hardware-amc/add-printer-consumable",
      },
      {
        name: "Link cartridge/drum to printer model",
        icon: AddLink,
        link: "/hardware-amc/link-printer-model",
        hasDivider: true,
      },
    ];
  }

  if (isAmcAdmin) {
    drawerItems = [
      ...drawerItems,
      {
        name: "Initiate PM Quarter",
        icon: CalendarMonth,
        link: "/preventive-maintenance/initiate-quarter",
      },
    ];
  }

  if (isAmcAdmin || isAmcEngineer) {
    drawerItems = [
      ...drawerItems,
      {
        name: "Current PM",
        icon: CleaningServices,
        link: "/preventive-maintenance/current",
      },
      {
        name: "PM Reports",
        icon: Assessment,
        link: "/preventive-maintenance/report",
        hasDivider: true,
      },
    ];
  }
  drawerItems = [
    ...drawerItems,
    {
      name: "Create a new order",
      icon: AddShoppingCart,
      link: "/printer-consumables/user/create-order",
    },
    {
      name: "Pending approvals",
      icon: PendingActions,
      link: "/printer-consumables/approver/pending-approvals",
      hasDivider: true,
    },
    {
      name: "Log a new complaint",
      icon: NoteAdd,
      link: "/complaint-monitoring/new-complaint",
    },
    {
      name: "Complaints History",
      icon: History,
      link: "/complaint-monitoring/complaints-history",
    },
  ];
  if (isAmcAdmin || isAmcEngineer) {
    drawerItems = [
      ...drawerItems,
      {
        name: "Pending Complaints",
        icon: PendingActions,
        link: "/complaint-monitoring/pending-complaints",
      },
      {
        name: "Closed Complaints",
        icon: InventoryOutlined,
        link: "/complaint-monitoring/closed-complaints",
      },
      {
        name: "Downtime Reports",
        icon: Assessment,
        link: "/complaint-monitoring/downtime-reports",
      },
    ];
  }

  return drawerItems;
}
