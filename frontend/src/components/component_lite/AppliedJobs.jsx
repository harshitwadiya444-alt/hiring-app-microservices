import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const allAppliedJobs =
    useSelector((store) => store.jobs.allAppliedJobs) || [];

  return (
    <div className="w-full">
      <Table>
        <TableCaption className="text-indigo-200">
          Your recently applied jobs
        </TableCaption>

        <TableHeader>
          <TableRow className="border-white/20">
            <TableHead className="text-indigo-200 font-semibold">
              Date
            </TableHead>
            <TableHead className="text-indigo-200 font-semibold">
              Job Title
            </TableHead>
            <TableHead className="text-indigo-200 font-semibold">
              Company
            </TableHead>
            <TableHead className="text-indigo-200 font-semibold text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6 text-gray-300"
              >
                You haven’t applied to any jobs yet 🚀
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow
                key={appliedJob._id}
                className="border-white/10 hover:bg-white/5 transition"
              >
                <TableCell className="text-gray-200">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="text-white font-medium">
                  {appliedJob?.job?.title}
                </TableCell>

                <TableCell className="text-gray-200">
                  {appliedJob?.job?.company?.name}
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    className={`px-3 py-1 rounded-full text-white ${
                      appliedJob?.status === "REJECTED"
                        ? "bg-red-500/80"
                        : appliedJob?.status === "SHORTLISTED"
                        ? "bg-green-500/80"
                        : "bg-yellow-500/80"
                    }`}
                  >
                    {appliedJob?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJob;
