import React from "react";
import JobCards from "./JobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);

  return (
    <div className="max-w-7xl mx-auto my-24 px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">
          Latest & Top{" "}
          <span className="text-indigo-400">Job Openings</span>
        </h2>
        <p className="text-gray-300 mt-2">
          Discover new opportunities curated for you
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allJobs.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            No jobs available at the moment
          </p>
        ) : (
          allJobs.slice(0, 6).map((job) =>
            job?._id ? (
              <JobCards key={job._id} job={job} />
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
