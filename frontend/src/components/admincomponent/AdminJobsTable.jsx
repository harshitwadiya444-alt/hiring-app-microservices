import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.jobs
  );
  const navigate = useNavigate();
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  useEffect(() => {
    const filtered =
      allAdminJobs?.filter((job) => {
        if (!searchJobByText) return true;
        return (
          job.title
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase()) ||
          job.company?.name
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      }) || [];

    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  return (
    <Table>
      <TableCaption>Your recent Posted Jobs</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filterJobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell>{job.company?.name}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.createdAt.split("T")[0]}</TableCell>

            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal />
                </PopoverTrigger>

               <PopoverContent className="w-40 p-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl">
  <div
    onClick={() => navigate(`/recruiter/dashboard/${job._id}`)}
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 cursor-pointer group"
  >
    <Eye className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
    <span className="text-sm font-medium">Applicants</span>
  </div>

  <div
    onClick={() => navigate(`/admin/jobs/update/${job._id}`)}
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 cursor-pointer group mt-1"
  >
    <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-purple-600" />
    <span className="text-sm font-medium">Edit Job</span>
  </div>
</PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminJobsTable;