
import React, { useEffect, useState } from "react";
import Navbar from "../component_lite/Navbar.jsx";
import { Button } from "../ui/button.jsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../../utils/data.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById.jsx";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.status === 200 && res.data.message) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto my-12">
        {/* CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-10">
          <form onSubmit={submitHandler}>
            {/* HEADER */}
            <div className="flex items-center gap-5 mb-8">
              <Button
                onClick={() => navigate("/admin/companies")}
                className="
                  flex items-center gap-2
                  bg-slate-800
                  hover:bg-slate-700
                  text-white
                  border border-white/10
                  shadow-md
                "
              >
                <ArrowLeft size={18} />
                Back
              </Button>

              <h1 className="font-bold text-2xl text-white">
                Company Setup
              </h1>
            </div>

            {/* FORM GRID */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Website</Label>
                <Input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-white/80">Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label className="text-white/80">Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* BUTTON */}
            {loading ? (
              <Button
                className="
                  w-full
                  mt-8
                  bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600
                  text-white
                  shadow-lg
                "
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="
                  w-full
                  mt-8
                  bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600
                  hover:from-indigo-600 hover:to-purple-700
                  text-white
                  font-semibold
                  shadow-xl
                  shadow-indigo-500/40
                  transition duration-300
                "
              >
                Update Company
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
