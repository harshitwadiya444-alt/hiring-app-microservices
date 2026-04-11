import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center">
      <div className="flex flex-col gap-6 my-16">

        {/* TOP BADGE */}
        <span className="px-5 mx-auto flex justify-center items-center py-2 gap-2 rounded-full 
          bg-white/10 backdrop-blur-md text-indigo-200 font-medium border border-white/20">
          <PiBuildingOfficeBold className="text-indigo-300" />
          Smart Hiring & Talent Matching Platform
        </span>

        {/* HERO HEADING */}
        <h2 className="text-5xl font-bold leading-tight text-white">
          Discover Talent. <br />
          Apply Smarter. <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Hire Faster.
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-300 max-w-2xl mx-auto text-base">
          A modern hiring platform where candidates discover opportunities and
          recruiters hire faster using intelligent resume matching and a
          streamlined ATS pipeline.
        </p>

        {/* SEARCH BAR */}
        <div
          className="flex w-[44%] mx-auto items-center gap-4 rounded-full
          bg-white/15 backdrop-blur-md border border-white/20 shadow-xl pl-4"
        >
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, skills or company"
            className="bg-transparent outline-none border-none w-full text-sm text-white placeholder:text-gray-300"
          />

          <Button
            onClick={searchjobHandler}
            className="rounded-r-full bg-indigo-600 hover:bg-indigo-700 px-6"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
