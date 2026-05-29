// import { isGatePassApprover } from "@/app/(main)/users/api";
import { hasRole } from "@/app/api";
import { getSession } from "@/app/api/auth/get-session";
import { USER_ROLES } from "@/app/enum";
import {
  Assessment,
  PendingActions,
  SvgIconComponent,
  NoteAdd,
  History,
    PersonAdd,
  AdminPanelSettings,
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

const canApproveGatePass = await hasRole([USER_ROLES.APPROVER]);
const isAdmin = await hasRole([USER_ROLES.ADMIN]);


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
  ];
if (canApproveGatePass) {
  drawerItems = [
    ...drawerItems,
    {
      name: "Pending Approvals",
      icon: PendingActions,
      link: "/approver/pending-approvals",
      hasDivider: true,
    },
    {
      name: "Approved Requests",
      icon: NoteAdd,
      link: "/approver/approved-requests",
    },
  ];
}
if (isAdmin) {
  drawerItems = [
    ...drawerItems,
    {
      name: "Admin Gate Pass Approvals",
      icon: PendingActions,
      link: "/admin/approvals",
    },
    {
      name: "Gate Pass Reports",
      icon: Assessment,
      link: "/admin/reports",
    },
    {
      name: "Approver Authorization",
      icon: AdminPanelSettings,
      link: "/admin/authorizations",
    },
  ];
}

  return drawerItems;
}
