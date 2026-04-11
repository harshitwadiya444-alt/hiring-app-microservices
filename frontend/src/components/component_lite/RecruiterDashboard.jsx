
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component_lite/Navbar";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const FILTERS = [
  "ALL",
  "SHORTLISTED",
  "REVIEW_REQUIRED",
  "INTERVIEW",
  "REJECTED",
];

const RecruiterDashboard = () => {

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { jobId } = useParams();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [scheduleDate, setScheduleDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("ONLINE");
  const [interviewType, setInterviewType] = useState("TECHNICAL");

  const fetchApplications = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/dashboard/applications?jobId=${jobId}&status=${filter}`,
        { withCredentials: true }
      );

      setApplications(res.data.applications);

    } catch (err) {

      toast.error("Failed to fetch applications");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (!jobId) return;

    fetchApplications();

  }, [filter, jobId]);

  const updateStatus = async (id, status) => {

    try {

      await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      toast.success("Status updated");

      fetchApplications();

    } catch {

      toast.error("Error updating status");

    }

  };

  const handleScheduleInterview = async () => {

    try {

      await axios.post(
        `${APPLICATION_API_ENDPOINT}/${selectedAppId}/schedule-interview`,
        {
          scheduledAt: scheduleDate,
          mode: interviewMode,
          type: interviewType,
        },
        { withCredentials: true }
      );

      toast.success("Interview scheduled");

      setIsScheduleOpen(false);
      setScheduleDate("");

      fetchApplications();

    } catch {

      toast.error("Failed to schedule interview");

    }

  };

  const interviewDecision = async (id, decision) => {

    try {

      await axios.post(
        `${APPLICATION_API_ENDPOINT}/${id}/interview-decision`,
        { decision },
        { withCredentials: true }
      );

      toast.success(`Interview ${decision}`);

      fetchApplications();

    } catch {

      toast.error("Decision failed");

    }

  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto my-8">

        <h1 className="text-2xl font-bold mb-6 text-white">
          Recruiter Dashboard
        </h1>

        <div className="flex gap-3 mb-6">

          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 border-gray-600 hover:bg-gray-700"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        <Table>

          <TableCaption>
            Applications sorted by AI score
          </TableCaption>

          <TableHeader>

            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>

            {applications.map((app) => (

              <TableRow key={app._id}>

                <TableCell>
                  {app.applicant.fullname}
                </TableCell>

                <TableCell>
                  {app.applicant.email}
                </TableCell>

                <TableCell>
                  {(app.score * 100).toFixed(1)}%
                </TableCell>

                <TableCell>
                  {app.status}
                </TableCell>

                <TableCell className="text-right space-x-2">

                  {(app.status === "SHORTLISTED" ||
                    app.status === "REVIEW_REQUIRED") && (

                    <>
                      <button
                        onClick={() => {
                          setSelectedAppId(app._id);
                          setIsScheduleOpen(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Schedule Interview
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(app._id, "REJECTED")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {app.status === "INTERVIEW" && (

                    <>
                      <button
                        onClick={() =>
                          interviewDecision(app._id, "PASS")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Pass
                      </button>

                      <button
                        onClick={() =>
                          interviewDecision(app._id, "FAIL")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Fail
                      </button>

                    </>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/applications/${app._id}/audit-log`)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                  >
                    Audit Log
                  </button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      {isScheduleOpen && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white w-[420px] rounded-xl shadow-2xl p-6">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Schedule Interview
            </h2>

            <label className="text-sm font-medium text-gray-700">
              Interview Date & Time
            </label>

            <input
              type="datetime-local"
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={scheduleDate}
              onChange={(e) =>
                setScheduleDate(e.target.value)
              }
            />

            <label className="text-sm font-medium text-gray-700">
              Interview Type
            </label>

            <select
              className="w-full mt-1 mb-4 p-2.5 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={interviewType}
              onChange={(e) =>
                setInterviewType(e.target.value)
              }
            >
              <option value="TECHNICAL">Technical</option>
              <option value="DSA">DSA</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="HR">HR</option>
              <option value="MANAGERIAL">Managerial</option>
              <option value="CULTURE_FIT">Culture Fit</option>
            </select>

            <label className="text-sm font-medium text-gray-700">
              Interview Mode
            </label>

            <select
              className="w-full mt-1 mb-6 p-2.5 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={interviewMode}
              onChange={(e) =>
                setInterviewMode(e.target.value)
              }
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setIsScheduleOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleScheduleInterview}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default RecruiterDashboard;
