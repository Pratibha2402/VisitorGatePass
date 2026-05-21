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
  PersonAdd,
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
   drawerItems = [
    ...drawerItems,
    {
      name: "Create a new GatePass",
      icon: PersonAdd,
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
