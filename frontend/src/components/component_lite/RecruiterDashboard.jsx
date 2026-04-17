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
    } catch {
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

      <div className="max-w-7xl mx-auto my-10 px-4 text-white">
        <h1 className="text-3xl font-semibold mb-8 tracking-wide">
          Recruiter Dashboard
        </h1>

        <div className="flex gap-3 mb-8 flex-wrap">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-full text-sm border transition backdrop-blur-md ${
                filter === item
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                  : "text-white/70 border-white/20 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 overflow-hidden">
          <Table>
            <TableCaption className="text-white/50 py-3">
              Applications sorted by AI score
            </TableCaption>

            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Candidate</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Score</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-right text-white">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.map((app) => (
                <TableRow
                  key={app._id}
                  className="border-white/10 hover:bg-white/5 transition"
                >
                  <TableCell>{app.applicant.fullname}</TableCell>

                  <TableCell className="text-white/80">
                    {app.applicant.email}
                  </TableCell>

                  <TableCell className="font-medium text-indigo-300">
                    {(app.score * 100).toFixed(1)}%
                  </TableCell>

                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300">
                      {app.status}
                    </span>
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
                          className="px-3 py-1.5 text-sm rounded-md bg-green-600/80 hover:bg-green-600 transition"
                        >
                          Schedule
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(app._id, "REJECTED")
                          }
                          className="px-3 py-1.5 text-sm rounded-md bg-red-600/80 hover:bg-red-600 transition"
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
                          className="px-3 py-1.5 text-sm rounded-md bg-green-600/80 hover:bg-green-600 transition"
                        >
                          Pass
                        </button>

                        <button
                          onClick={() =>
                            interviewDecision(app._id, "FAIL")
                          }
                          className="px-3 py-1.5 text-sm rounded-md bg-red-600/80 hover:bg-red-600 transition"
                        >
                          Fail
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        navigate(`/applications/${app._id}/audit-log`)
                      }
                      className="px-3 py-1.5 text-sm rounded-md bg-white/10 hover:bg-white/20 transition"
                    >
                      Audit Log
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isScheduleOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-[#1e1f3f] to-[#2e2f6e] border border-white/10 text-white w-[420px] rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              Schedule Interview
            </h2>

            <label className="text-sm text-white/80">
              Interview Date & Time
            </label>

            <input
              type="datetime-local"
              className="w-full mt-1 mb-4 p-2.5 bg-white/10 border border-white/20 rounded-md text-white"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />

            <label className="text-sm text-white/80">
              Interview Type
            </label>

            <select
              className="w-full mt-1 mb-4 p-2.5 bg-white/10 border border-white/20 rounded-md text-white"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
            >
              <option value="TECHNICAL">Technical</option>
              <option value="DSA">DSA</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="HR">HR</option>
              <option value="MANAGERIAL">Managerial</option>
              <option value="CULTURE_FIT">Culture Fit</option>
            </select>

            <label className="text-sm text-white/80">
              Interview Mode
            </label>

            <select
              className="w-full mt-1 mb-6 p-2.5 bg-white/10 border border-white/20 rounded-md text-white"
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleScheduleInterview}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
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