import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Contact,
  Mail,
  Pen,
  AlertTriangle,
  CheckCircle,
  Building2
} from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJobs";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";

const Profile = () => {

  useGetAppliedJobs();

  const [open, setOpen] = useState(false);

  const { user, company } = useSelector((store) => store.auth);

  console.log(user);
  console.log(company);

  const isRecruiter = user?.role?.toLowerCase() === "recruiter";

  const isResume = Boolean(user?.profile?.resume);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#6d28d9]">

      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-4">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

          {/* HEADER */}

          <div className="flex justify-between items-start">

            <div className="flex items-center gap-6">

              <Avatar className="h-24 w-24 ring-4 ring-indigo-500/40">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                />
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.fullname}
                </h1>

                <p className="text-gray-300">
                  {user?.profile?.bio || "No bio added"}
                </p>
              </div>

            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20"
            >
              <Pen className="text-white" />
            </Button>

          </div>

          {/* RESUME STATUS (Candidate Only) */}

          {!isRecruiter && (
            <div className="my-6">

              {!isResume ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/40 text-yellow-200">
                  <AlertTriangle />
                  <div>
                    <p className="font-semibold">
                      Resume required before applying
                    </p>
                    <p className="text-sm text-yellow-100">
                      Upload your resume to unlock job applications.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-400/40 text-green-200">
                  <CheckCircle />
                  <div>
                    <p className="font-semibold">
                      Resume uploaded successfully
                    </p>
                    <p className="text-sm text-green-100">
                      Your profile is ready for recruiters.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* CONTACT */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">

            <div className="flex items-center gap-3 text-gray-200">
              <Mail />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-200">
              <Contact />
              <span>{user?.phoneNumber}</span>
            </div>

          </div>

          {/* SKILLS */}

          <div className="my-6">

            <h2 className="text-lg font-semibold text-white mb-2">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/40"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400">NA</span>
              )}

            </div>

          </div>

          {/* COMPANY SECTION (Recruiter Only) */}

          {isRecruiter && (

            <div className="my-6">

              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} />
                Company
              </h2>

              {company ? (

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">

                  <img
                    src={company.logo}
                    alt="company logo"
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <div>
                    <p className="text-white font-semibold">
                      {company.name}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {company.location}
                    </p>
                  </div>

                </div>

              ) : (

                <p className="text-gray-400">
                  No company linked
                </p>

              )}

            </div>

          )}

          {/* RESUME DOWNLOAD (Candidate Only) */}

          {!isRecruiter && (

            <div className="my-6">

              <h2 className="text-lg font-semibold text-white mb-2">
                Resume
              </h2>

              {isResume ? (

                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 hover:text-indigo-400 underline"
                >
                  Download {user.profile.resumeOriginalName}
                </a>

              ) : (

                <span className="text-gray-400">
                  No resume uploaded
                </span>

              )}

            </div>

          )}

        </div>

      </div>

      {!isRecruiter && (
        <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold text-white mb-4">
              Applied Jobs
            </h2>

            <AppliedJob />

          </div>

        </div>
      )}

      <EditProfileModal open={open} setOpen={setOpen} />

    </div>
  );
};

export default Profile;