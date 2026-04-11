import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "../../hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-10">
          Search Results
          <span className="text-indigo-400 ml-2">
            ({allJobs.length})
          </span>
        </h1>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs.map((job) => (
            <Job1 key={job._id} job={job} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Browse;