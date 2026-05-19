import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/app/enum";
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

  const isAdmin = await hasRole([
    USER_ROLES.ADMIN,
   ]);
  const isApprover = await hasRole([
    USER_ROLES.APPROVER,
  ]);
  // if (isAdmin || isApprover) {
  //   drawerItems = [
  //     ...drawerItems,
  //     {
  //       name: "Asset models list",
  //       icon: Dvr,
  //       link: "/asset-model",
  //     },
  //     {
  //       name: "Assets list",
  //       icon: Dvr,
  //       link: "/asset",
  //     },
  //     {
  //       name: "Add an asset model",
  //       icon: AddToQueue,
  //       link: "/asset-model/add",
  //     },
  //     {
  //       name: "Add an asset",
  //       icon: AddToQueue,
  //       link: "/asset/add",
  //     },
  //     {
  //       name: "Add a printer consumable",
  //       icon: AddCircle,
  //       link: "/hardware-amc/add-printer-consumable",
  //     },
  //     {
  //       name: "Link cartridge/drum to printer model",
  //       icon: AddLink,
  //       link: "/hardware-amc/link-printer-model",
  //       hasDivider: true,
  //     },
  //   ];
  // }

  // if (isAmcAdmin) {
  //   drawerItems = [
  //     ...drawerItems,
  //     {
  //       name: "Initiate PM Quarter",
  //       icon: CalendarMonth,
  //       link: "/preventive-maintenance/initiate-quarter",
  //     },
  //   ];
  // }

  // if (isAmcAdmin || isAmcEngineer) {
  //   drawerItems = [
  //     ...drawerItems,
  //     {
  //       name: "Current PM",
  //       icon: CleaningServices,
  //       link: "/preventive-maintenance/current",
  //     },
  //     {
  //       name: "PM Reports",
  //       icon: Assessment,
  //       link: "/preventive-maintenance/report",
  //       hasDivider: true,
  //     },
  //   ];
  // }
  drawerItems = [
    ...drawerItems,
    {
      name: "Create a new GatePass",
      icon: AddShoppingCart,
      link: "/users/create-visitors",
    },
    {
      name: "GatePass History",
      icon: History,
      link: "/users/view-visitors",
    },
    {
      name: "Pending approvals",
      icon: PendingActions,
      link: "/gatepass/approver/pending-approvals",
      hasDivider: true,
    },

  ];
  if(isApprover){
    drawerItems = [
      ...drawerItems,
      {
        name: "Approved Requests",
        icon: NoteAdd,
        link: "/gatepass/approver/approved-requests",
      },
    ];
  }
  if (isAdmin ) {
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
