import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="
        p-6 rounded-2xl
        bg-[#020617]/60
        backdrop-blur-xl
        border border-white/10
        text-white
        cursor-pointer
        transition-all duration-300
        hover:border-indigo-400/40
        hover:shadow-2xl hover:shadow-indigo-500/20
        hover:-translate-y-1
      "
    >
      {/* Company Info */}
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-white">
          {job?.company?.name || "Company Name"}
        </h1>
        <p className="text-sm text-gray-400">
          {job?.location || "India"}
        </p>
      </div>

      {/* Job Title */}
      <h2 className="font-bold text-xl text-indigo-300 mb-2">
        {job?.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-300 line-clamp-2">
        {job?.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge className="bg-indigo-500/20 text-indigo-300">
          {job?.position} Positions
        </Badge>

        <Badge className="bg-orange-500/20 text-orange-300">
          {job?.salary} LPA
        </Badge>

        <Badge className="bg-purple-500/20 text-purple-300">
          {job?.jobType}
        </Badge>

        <Badge className="bg-emerald-500/20 text-emerald-300">
          {job?.experienceLevel}+ yrs
        </Badge>
      </div>

      {/* Skills Preview */}
      {job?.requirements?.length > 0 && (
        <p className="text-xs text-gray-400 mt-4">
          Skills: {job.requirements.slice(0, 3).join(", ")}...
        </p>
      )}
    </div>
  );
};

export default JobCards;
