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

                <PopoverContent className="w-32">
                  <div
                    onClick={() =>
                      navigate(`/recruiter/dashboard/${job._id}`)
                    }
                    className="flex gap-2 cursor-pointer"
                  >
                    <Eye className="w-4" />
                    Applicants
                  </div>

                  <div
                    onClick={() =>
                      navigate(`/admin/jobs/update/${job._id}`)
                    }
                    className="flex gap-2 cursor-pointer mt-2"
                  >
                    <Edit2 className="w-4" />
                    Edit
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