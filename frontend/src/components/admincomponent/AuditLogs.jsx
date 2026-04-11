import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../component_lite/Navbar";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const AuditLogPage = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/${id}/audit-log`,
        { withCredentials: true }
      );
      setLogs(res.data.auditLogs);
    };

    fetchLogs();
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto my-8 text-white">
        <h1 className="text-2xl font-bold mb-6">
          Application Audit Log
        </h1>

        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="border border-white/10 bg-white/5 p-4 rounded-lg"
            >
              <div className="flex justify-between">
                <span className="font-semibold">
                  {log.action.replace("_", " ")}
                </span>

                <span className="text-sm text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-sm text-gray-300 mt-1">
                {log.previousStatus && (
                  <span>
                    {log.previousStatus} → {log.newStatus}
                  </span>
                )}
              </div>

              {log.note && (
                <p className="text-sm mt-2 text-gray-200">
                  {log.note}
                </p>
              )}

              {log.performedBy && (
                <p className="text-xs mt-2 text-gray-400">
                  By: {log.performedBy.fullname}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AuditLogPage;