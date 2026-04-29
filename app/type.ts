import type {
  ApprovingAuthority,
  VehicleApprovingAuthority,
} from "@/app/database/data";

export type VisitorFormValues = {
  officerName: string;
  designation: string;
  department: string;
  intercom: string;
  purpose: string;
  dateRange: [Date | null, Date | null];
  timeRange: [Date | null, Date | null];
  // fromdate: Date | null;
  // todate: Date | null;
  vehicleentry: string;
  approvingAuthority: ApprovingAuthority | VehicleApprovingAuthority | null;
  company: string;
  title: string;
  name: string;
  address1: string;
  address2: string;
  age: string;
  phone: string;
  gender: string;
  nationality: string;
  laptopcarry: string;
};

export type VisitorGridRow = {
  id: number;
  company: string;
  title: string;
  name: string;
  address1: string;
  address2: string;
  age: string;
  phone: string;
  gender: string;
  nationality: string;
  laptopcarry: string;
};
