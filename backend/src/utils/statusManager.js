import { publishStatusUpdate } from "../notificationService/notificationProducer.js";

export const updateStatusCentral = async ({
  application,
  newStatus,
  action,
  note,
  performedBy,
  type
}) => {

  const previousStatus = application.status;

  application.status = newStatus;

  application.auditLogs.push({
    action,
    previousStatus,
    newStatus,
    performedBy,
    note
  });

  await application.save();

  await publishStatusUpdate({
    type: "STATUS_UPDATED",
    applicationId: application._id.toString(),
    newStatus,
    userId: application.applicant.toString(),
    message: note,
    interviewType: type
  });

};

export default updateStatusCentral;