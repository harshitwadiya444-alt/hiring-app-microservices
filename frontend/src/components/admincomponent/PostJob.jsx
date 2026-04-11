
import React, { useState } from "react";
import Navbar from "../component_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    jobType: "",
    position: "",
    interviewRounds: "",
    requiredSkills: "",
    requiredTools: "",
    experienceLevel: "",
    education: "ANY",
    companyId: "",
  });

  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCompanyHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );

    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const jobData = {
      title: input.title,
      description: input.description,
      salary: Number(input.salary),
      location: input.location,
      jobType: input.jobType,
      position: Number(input.position),
      interviewConfig: {
        totalRounds: Number(input.interviewRounds),
      },
      experienceLevel: Number(input.experienceLevel),

      requiredSkills: input.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      requiredTools: input.requiredTools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),

      education: input.education,
      companyId: input.companyId,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        `${JOB_API_ENDPOINT}/post`,
        jobData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job Posted Successfully ✅");
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto my-12">

        {/* FORM CARD */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-10">

          <form onSubmit={submitHandler}>

            <h1 className="text-2xl font-bold text-white mb-6">
              Post New Job
            </h1>

            <div className="grid grid-cols-2 gap-6">

              {/* JOB TITLE */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Job Title</Label>
                <Input
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* LOCATION */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Location</Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* SALARY */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Salary (LPA)</Label>
                <Input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* JOB TYPE */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Job Type</Label>
                <Input
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* POSITION */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Open Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* EXPERIENCE */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Experience</Label>
                <Input
                  type="number"
                  name="experienceLevel"
                  value={input.experienceLevel}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* INTERVIEW ROUNDS */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Interview Rounds</Label>
                <Input
                  type="number"
                  name="interviewRounds"
                  value={input.interviewRounds}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* SKILLS */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Required Skills</Label>
                <Input
                  name="requiredSkills"
                  placeholder="React, Node, MongoDB"
                  value={input.requiredSkills}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* TOOLS */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Required Tools</Label>
                <Input
                  name="requiredTools"
                  placeholder="Git, Docker"
                  value={input.requiredTools}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white/10"
                />
              </div>

              {/* EDUCATION */}
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Education</Label>

                <Select
                  onValueChange={(value) =>
                    setInput({ ...input, education: value })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select Education" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="BTECH">B.Tech</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                      <SelectItem value="ANY">Any</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* COMPANY */}
              <div className="flex flex-col gap-2">

                <Label className="text-white/80">Company</Label>

                {companies.length > 0 && (

                  <Select onValueChange={selectCompanyHandler}>

                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectGroup>

                        {companies.map((company) => (

                          <SelectItem
                            key={company._id}
                            value={company.name.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>

                        ))}

                      </SelectGroup>

                    </SelectContent>

                  </Select>

                )}

              </div>

            </div>

            {/* BUTTON */}

            <div className="mt-8">

              <Button
                type="submit"
                className="
                w-full
                bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600
                hover:from-indigo-600 hover:to-purple-700
                text-white
                font-semibold
                shadow-xl
                shadow-indigo-500/40
                transition duration-300
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default PostJob;
