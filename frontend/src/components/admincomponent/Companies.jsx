import React, { useEffect, useState } from "react";
import Navbar from "../component_lite/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "../../redux/jobSlice";
import AdminJobsTable from "./AdminJobsTable";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAllCompanies();
  useGetAllAdminJobs();

  const { companies } = useSelector((store) => store.company);
  const company = companies?.[0];

  const [jobSearch, setJobSearch] = useState("");

  useEffect(() => {
    dispatch(setSearchJobByText(jobSearch));
  }, [jobSearch, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/80 to-purple-900/80 text-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {!company ? (
          <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-16 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-white">
              No Company Found
            </h2>
            <p className="text-gray-300 mt-3">
              Please create your company to continue
            </p>
            <Button
              className="mt-6 px-6 py-3"
              onClick={() => navigate("/admin/companies/create")}
            >
              Create Company
            </Button>
          </div>
        ) : (
          /* ================= SINGLE MASTER CARD ================= */
          <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-12 shadow-2xl space-y-12">
            
            {/* ===== TOP SECTION: COMPANY INFO ===== */}
            <div className="relative flex items-start gap-10">
              {/* Edit Button */}
              <Button
                variant="secondary"
                className="absolute top-0 right-0"
                onClick={() =>
                  navigate(`/admin/companies/${company._id}`)
                }
              >
                Edit Company
              </Button>

              <img
                src={company.logo}
                alt="company logo"
                className="w-36 h-36 rounded-full border-4 border-white/30 object-cover"
              />

              <div className="flex-1">
                <h1 class="text-3xl font-semibold text-slate-50">
                  {company.name}
                 </h1>

                <p className="text-base text-gray-300 mt-3 leading-relaxed max-w-4xl">
                  {company.description}
                </p>

                <p className="text-sm text-gray-400 mt-3">
                  Created on {company.createdAt?.split("T")[0]}
                </p>

                {/* Post Job CTA */}
                <Button
                  className="mt-6 px-6 py-3"
                  onClick={() => navigate("/admin/jobs/create")}
                >
                  Post Job
                </Button>
              </div>
            </div>

            {/* ===== DIVIDER ===== */}
            <div className="h-px bg-white/10" />

            {/* ===== BOTTOM SECTION: JOBS ===== */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Posted Jobs
                </h2>

                <Input
                  className="w-72 bg-black/20 border-white/20"
                  placeholder="Filter by job title"
                  onChange={(e) => setJobSearch(e.target.value)}
                />
              </div>

              <AdminJobsTable />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
