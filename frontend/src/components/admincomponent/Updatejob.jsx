import React, { useEffect, useState } from "react";
import Navbar from "../component_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

const UpdateJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    jobType: "",
    position: "",
    experienceLevel: "",
    interviewRounds: "",
    education: "ANY",
    requiredSkills: "",
    requiredTools: "",
  });

  // =========================
  // FETCH JOB DATA
  // =========================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.status) {
          const job = res.data.job;

          setInput({
            title: job.title || "",
            description: job.description || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            position: job.position || "",
            experienceLevel: job.experienceLevel || "",
            interviewRounds: job.interviewConfig?.totalRounds || "",
            education: job.education || "ANY",
            requiredSkills: (job.requiredSkills || []).join(", "),
            requiredTools: (job.requiredTools || []).join(", "),
          });
        }
      } catch (error) {
        toast.error("Failed to load job");
      }
    };

    fetchJob();
  }, [jobId]);

  // =========================
  // HANDLERS
  // =========================
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedJob = {
      title: input.title,
      description: input.description,
      salary: Number(input.salary),
      location: input.location,
      jobType: input.jobType,
      position: Number(input.position),
      experienceLevel: Number(input.experienceLevel),

      interviewConfig: {
        totalRounds: Number(input.interviewRounds),
      },

      education: input.education,

      requiredSkills: input.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      requiredTools: input.requiredTools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);

      const res = await axios.put(
        `${JOB_API_ENDPOINT}/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job Updated Successfully ✅");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center w-screen my-6">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-400 shadow-md rounded-lg"
        >
          <div className="grid grid-cols-2 gap-5">

            <div>
              <Label>Job Title</Label>
              <Input name="title" value={input.title} onChange={changeHandler} />
            </div>

            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeHandler} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeHandler} />
            </div>

            <div>
              <Label>Salary (LPA)</Label>
              <Input type="number" name="salary" value={input.salary} onChange={changeHandler} />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeHandler} />
            </div>

            <div>
              <Label>Open Positions</Label>
              <Input type="number" name="position" value={input.position} onChange={changeHandler} />
            </div>

            <div>
              <Label>Experience Required (Years)</Label>
              <Input
                type="number"
                name="experienceLevel"
                value={input.experienceLevel}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Interview Rounds</Label>
              <Input
                type="number"
                name="interviewRounds"
                value={input.interviewRounds}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Required Skills</Label>
              <Input
                name="requiredSkills"
                value={input.requiredSkills}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Required Tools</Label>
              <Input
                name="requiredTools"
                value={input.requiredTools}
                onChange={changeHandler}
              />
            </div>

            <div>
              <Label>Education</Label>
              <Select
                value={input.education}
                onValueChange={(value) =>
                  setInput({ ...input, education: value })
                }
              >
                <SelectTrigger>
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

          </div>

          <div className="flex justify-center mt-6">
            <Button type="submit" className="w-full bg-black text-white">
              {loading ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;