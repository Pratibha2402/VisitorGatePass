import { VisitorMultiple } from "./Visitor_Master";
import { VisitorMultipleDetail } from "./VisitorMultipleDetails";
import { Employee } from "./Employee";
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



if (!VisitorMultiple.associations.visitedEmployee) {
  VisitorMultiple.belongsTo(Employee, {
    foreignKey: "createdBy",
    targetKey: "username",
    as: "visitedEmployee",
  });
}