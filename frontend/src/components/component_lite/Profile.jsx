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

  const isRecruiter = user?.role?.toLowerCase() === "recruiter";
  const isResume = Boolean(user?.profile?.resume);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1023] via-[#1e1b4b] to-[#4c1d95]">

      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 px-4">

        {/* MAIN PROFILE CARD */}

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          {/* HEADER */}

          <div className="flex justify-between items-start">

            <div className="flex items-center gap-6">

              <Avatar className="h-24 w-24 ring-4 ring-indigo-500/40 shadow-lg">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                />
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  {user?.fullname}
                </h1>

                <p className="text-indigo-200 mt-1">
                  {user?.profile?.bio || "No bio added yet"}
                </p>
              </div>

            </div>

            <Button
              onClick={() => setOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
            >
              <Pen size={16}/>
            </Button>

          </div>

          {/* CONTACT */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">

            <div className="flex items-center gap-3 text-gray-200">
              <Mail className="text-indigo-400"/>
              <span className="font-medium">{user?.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-200">
              <Contact className="text-indigo-400"/>
              <span className="font-medium">{user?.phoneNumber}</span>
            </div>

          </div>

          {/* SKILLS */}

          <div className="my-8">

            <h2 className="text-xl font-semibold text-white mb-3">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 px-3 py-1 text-sm"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400">No skills added</span>
              )}

            </div>

          </div>

          {/* COMPANY (Recruiter Only) */}

          {isRecruiter && (

            <div className="my-8">

              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="text-indigo-400"/>
                Company
              </h2>

              {company ? (

                <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-xl">

                  <img
                    src={company.logo}
                    alt="company logo"
                    className="h-14 w-14 rounded-lg object-cover shadow-md"
                  />

                  <div>
                    <p className="text-lg font-semibold text-white">
                      {company.name}
                    </p>

                    <p className="text-indigo-200 text-sm">
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

          {/* RESUME (Candidate Only) */}

          {!isRecruiter && (

            <div className="my-8">

              <h2 className="text-xl font-semibold text-white mb-3">
                Resume
              </h2>

              {isResume ? (

                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
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

      {/* APPLIED JOBS */}

      {!isRecruiter && (

        <div className="max-w-4xl mx-auto mt-12 px-4 pb-20">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

            <h2 className="text-2xl font-bold text-white mb-4">
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