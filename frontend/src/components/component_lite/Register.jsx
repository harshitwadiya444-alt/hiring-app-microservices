import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key]) formData.append(key, input[key]);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#6d28d9] px-4">

      <form
        onSubmit={submitHandler}
        className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        {/* HEADING */}
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Create Account
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Join <span className="text-indigo-400 font-semibold">HireFlow</span> and start hiring smarter
        </p>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label className="text-gray-100">Full Name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="glass-input"
            />
          </div>

          <div>
            <Label className="text-gray-100">Email</Label>
            <Input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="johndoe@gmail.com"
              className="glass-input"
            />
          </div>

          <div>
            <Label className="text-gray-100">Password</Label>
            <Input
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="********"
              className="glass-input"
            />
          </div>

          <div>
            <Label className="text-gray-100">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="+91XXXXXXXXXX"
              className="glass-input"
            />
          </div>

          <div>
            <Label className="text-gray-100">PAN Card</Label>
            <Input
              name="pancard"
              value={input.pancard}
              onChange={changeEventHandler}
              placeholder="ABCDE1234F"
              className="glass-input"
            />
          </div>

          <div>
            <Label className="text-gray-100">Aadhar Card</Label>
            <Input
              name="adharcard"
              value={input.adharcard}
              onChange={changeEventHandler}
              placeholder="123456789012"
              className="glass-input"
            />
          </div>
        </div>

        {/* ROLE */}
        <RadioGroup className="flex gap-6 my-5">
          <label className="flex items-center gap-2 text-gray-200">
            <input
              type="radio"
              name="role"
              value="Student"
              checked={input.role === "Student"}
              onChange={changeEventHandler}
              className="accent-indigo-500 scale-110"
            />
            Student
          </label>

          <label className="flex items-center gap-2 text-gray-200">
            <input
              type="radio"
              name="role"
              value="Recruiter"
              checked={input.role === "Recruiter"}
              onChange={changeEventHandler}
              className="accent-indigo-500 scale-110"
            />
            Recruiter
          </label>
        </RadioGroup>

        {/* FILE */}
        <div className="mb-4">
          <Label className="text-gray-100">Profile Photo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={changeFileHandler}
            className="glass-input file:text-gray-200 file:bg-transparent file:border-0"
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-300 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
