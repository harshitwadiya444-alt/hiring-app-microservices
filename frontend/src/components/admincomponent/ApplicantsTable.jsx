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
import { useSelector } from "react-redux";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  return (
    <div>
      <Table>
        <TableCaption className="text-gray-300">
          List of candidates who applied for this job
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="text-white font-semibold">
              Full Name
            </TableHead>
            <TableHead className="text-white font-semibold">
              Email
            </TableHead>
            <TableHead className="text-white font-semibold">
              Contact
            </TableHead>
            <TableHead className="text-white font-semibold">
              Resume
            </TableHead>
            <TableHead className="text-white font-semibold">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-gray-100">
          {applicants?.applications?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-gray-400"
              >
                No Applicants Found
              </TableCell>
            </TableRow>
          ) : (
            applicants?.applications?.map((item) => (
              <TableRow
                key={item._id}
                className="hover:bg-white/10 transition"
              >
                <TableCell className="text-white">
                  {item?.applicant?.fullname}
                </TableCell>

                <TableCell className="text-gray-100">
                  {item?.applicant?.email}
                </TableCell>

                <TableCell className="text-gray-100">
                  {item?.applicant?.phoneNumber || "NA"}
                </TableCell>

                <TableCell>
                  {item?.applicant?.profile?.resume ? (
                    <a
                      href={item.applicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-400">NA</span>
                  )}
                </TableCell>

                <TableCell className="text-gray-100">
                  {item?.createdAt?.split("T")[0]}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
