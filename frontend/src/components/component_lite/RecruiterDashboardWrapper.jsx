import React from "react";
import { useParams } from "react-router-dom";
import RecruiterDashboard from "./RecruiterDashboard";

const RecruiterDashboardWrapper = () => {
  const { jobId } = useParams();
  return <RecruiterDashboard key={jobId} />;
};

export default RecruiterDashboardWrapper;