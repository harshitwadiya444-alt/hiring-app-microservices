import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const Description = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const { singleJob } = useSelector((store) => store.jobs);
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const [isApplied, setIsApplied] = useState(false);

  const applyJobHandler = async () => {
    if (!user?.profile?.resume) {
      toast.error("Please upload your resume before applying");
      navigate("/profile", {
        state: { warning: "Resume upload is compulsory before applying" },
      });
      return;
    }

    try {
       const res = await axios.post(
     `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
     {},
      {
      withCredentials: true,
      }
   );
     
      if (res.data.success) {
        toast.success("Applied Successfully");
        setIsApplied(true);

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...singleJob.applications,
              { applicant: user?._id },
            ],
          })
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Apply Failed");
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchSingleJob = async () => {
      const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.status) {
        dispatch(setSingleJob(res.data.job));

        const applied =
          res.data.job.applications?.some(
            (app) =>
              app.applicant === user?._id ||
              app.applicant?._id === user?._id
          ) || false;

        setIsApplied(applied);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (!singleJob) {
    return <p className="text-center text-white mt-20">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-24 text-white grid grid-cols-12 gap-10">

      {/* LEFT */}
      <div className="col-span-8 space-y-10">

        <div>
          <h1 className="text-3xl font-bold">{singleJob.title}</h1>

          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge className="bg-blue-500/20 text-blue-300">1 Position</Badge>
            <Badge className="bg-green-500/20 text-green-300">
              {singleJob.salary} LPA
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300">
              {singleJob.jobType}
            </Badge>
            <Badge className="bg-red-500/20 text-red-300">
              {singleJob.location}
            </Badge>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-300 leading-relaxed">
            {singleJob.description}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">ATS Requirements</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-gray-200 mb-2">Required Skills</h3>
              <div className="flex gap-2 flex-wrap">
                {singleJob.requiredSkills?.map((s, i) => (
                  <Badge
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-gray-200 mb-2">Required Tools</h3>
              <div className="flex gap-2 flex-wrap">
                {singleJob.requiredTools?.map((t, i) => (
                  <Badge
                    key={i}
                    className="bg-pink-500/20 text-pink-300"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT */}
      <div className="col-span-4">
        <div className="sticky top-24 rounded-xl border border-white/10 bg-black/20 p-6 space-y-4">

          <Button
            disabled={isApplied}
            onClick={applyJobHandler}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>

          {!user?.profile?.resume && (
            <p className="text-sm text-yellow-300">
              ⚠ Resume upload required
            </p>
          )}

          <div className="text-sm text-gray-300 space-y-2 pt-4 border-t border-white/10">
            <p>
              <b className="text-white">Experience:</b>{" "}
              {singleJob.experienceLevel} Years
            </p>
            <p>
              <b className="text-white">Education:</b> {singleJob.education}
            </p>
            <p>
              <b className="text-white">Applicants:</b>{" "}
              {singleJob.applications?.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
