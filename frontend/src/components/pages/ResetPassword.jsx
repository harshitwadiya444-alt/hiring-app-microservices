import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/reset-password/${token}`,
        { password }
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#6d28d9] px-4">

      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Reset Password
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Enter your new password below
        </p>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
        >
          Reset Password
        </button>

      </form>
    </div>
  );
};

export default ResetPassword;