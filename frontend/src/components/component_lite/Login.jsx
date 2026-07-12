import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.role) {
      toast.error("Please select Student or Recruiter");
      return;
    }

    try {

      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_ENDPOINT}/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
      dispatch(
         setUser({
          user: res.data.user,
           company: res.data.company || null,
          })
          );
        toast.success(res.data.message);
        if (res.data.user.role === "Recruiter") {
            navigate("/admin/companies"); // ya recruiter dashboard
             } else {
               navigate("/");
          }
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Login failed"
      );

    } finally {

      dispatch(setLoading(false));

    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#6d28d9] px-4">

      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >

        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Welcome Back
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Login to <span className="text-indigo-400 font-semibold">HireFlow</span>
        </p>

        {/* EMAIL */}

        <div className="mb-4">

          <Label className="text-gray-100">Email</Label>

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="johndoe@gmail.com"
            className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-4">

          <div className="flex justify-between items-center mb-1">

            <Label className="text-gray-100">Password</Label>

            <Link
              to="/forgot-password"
              className="text-sm text-indigo-300 hover:text-indigo-400"
            >
              Forgot Password?
            </Link>

          </div>

          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="********"
            className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />

        </div>

        {/* ROLE */}

        <div className="flex gap-6 my-5 text-gray-200">

          <label className="flex items-center gap-2">

            <input
              type="radio"
              name="role"
              value="Student"
              checked={input.role === "Student"}
              onChange={changeEventHandler}
              className="accent-indigo-500"
            />

            Student

          </label>

          <label className="flex items-center gap-2">

            <input
              type="radio"
              name="role"
              value="Recruiter"
              checked={input.role === "Recruiter"}
              onChange={changeEventHandler}
              className="accent-indigo-500"
            />

            Recruiter

          </label>

        </div>

        {/* BUTTON */}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
        >

          {loading ? "Logging in..." : "Login"}

        </button>

        <p className="text-center text-gray-300 mt-5">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-indigo-400 hover:underline"
          >
            Register
          </Link>

        </p>

      </form>

    </div>

  );
};

export default Login;