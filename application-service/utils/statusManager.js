import { publishStatusUpdate } from "../services/notificationProducer.js";

export const updateStatusCentral = async ({
  application,
  newStatus,
  action,
  note,
  performedBy,
  type,
  candidateEmail,
  candidateName,
  jobTitle,
  companyName
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
    userId: application.applicant.toString(),
    newStatus,
    message: note,
    interviewType: type || null,
    candidateEmail,
    candidateName,
    jobTitle,
    companyName
  });

};

export default updateStatusCentral;