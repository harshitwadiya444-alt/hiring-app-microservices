import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bookmark } from "lucide-react";

const Job1 = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      className="
      p-6 rounded-xl
      bg-slate-800/70
      backdrop-blur-lg
      border border-indigo-500/20
      shadow-2xl
      hover:shadow-indigo-500/20
      hover:-translate-y-1
      transition duration-300
      "
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-400">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        {/* Bookmark */}
        <Button
          size="icon"
          className="
          rounded-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          shadow-md
          "
        >
          <Bookmark size={16} />
        </Button>

      </div>

      {/* Company */}
      <div className="flex items-center gap-3 my-4">

        <Avatar className="w-12 h-12 border border-indigo-400/30">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>

        <div>
          <h1 className="font-semibold text-lg text-white">
            {job?.company?.name}
          </h1>

          <p className="text-sm text-gray-400">
            {job?.location || "India"}
          </p>
        </div>

      </div>

      {/* Title */}
      <div>

        <h1 className="font-bold text-xl text-white mb-2">
          {job?.title}
        </h1>

        <p className="text-sm text-gray-300 line-clamp-2">
          {job?.description}
        </p>

      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">

        <Badge className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
          {job?.position} Positions
        </Badge>

        <Badge className="bg-red-600/20 text-red-300 border border-red-500/30">
          {job?.jobType}
        </Badge>

        <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30">
          {job?.salary} LPA
        </Badge>

        <Badge className="bg-green-600/20 text-green-300 border border-green-500/30">
          {job?.experienceLevel}+ yrs Exp
        </Badge>

        <Badge className="bg-gray-700 text-gray-200">
          {job?.location}
        </Badge>

      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-6">

        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="
          bg-slate-700
          hover:bg-slate-600
          text-white
          border border-slate-600
          "
        >
          Details
        </Button>

        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          Save For Later
        </Button>

      </div>
    </div>
  );
};

export default Job1;