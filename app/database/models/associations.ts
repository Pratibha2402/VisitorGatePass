import { VisitorMultiple } from "./Visitor_Master";
import { VisitorMultipleDetail } from "./VisitorMultipleDetails";
import { Employee } from "./Employee";
import { VisitorGatepassHods } from "./VisitorGatePassHOD";
import { VisitorGatepassVehicleHods } from "./VisitorGatePassVehicleHOD";
if (!VisitorMultiple.associations.details) {
  VisitorMultiple.hasOne(VisitorMultipleDetail, {
    foreignKey: "vId",
    sourceKey: "vId",
    as: "details",
  });
}

if (!VisitorMultipleDetail.associations.visitor) {
  VisitorMultipleDetail.belongsTo(VisitorMultiple, {
    foreignKey: "vId",
    targetKey: "vId",
    as: "visitor",
  });
}



if (!VisitorGatepassHods.associations.approver) {
  VisitorGatepassHods.belongsTo(Employee, {
    foreignKey: "hodEmpId",
    targetKey: "empNo",
    as:"approver",
  });
}
if (!VisitorGatepassVehicleHods.associations.approver) {
  VisitorGatepassVehicleHods.belongsTo(Employee, {
    foreignKey: "hodEmpId",
    targetKey: "empNo",
    as:"approver",
  });
}
if (!VisitorMultiple.associations.visitedEmployee) {
  VisitorMultiple.belongsTo(Employee, {
    foreignKey: "createdBy",
    targetKey: "username",
    as: "visitedEmployee",
  });
}
if (!VisitorMultiple.associations.approver) {
  VisitorMultiple.belongsTo(Employee, {
    foreignKey: "approvingAuth",
    targetKey: "empNo",
    as: "approver",
  });
}

