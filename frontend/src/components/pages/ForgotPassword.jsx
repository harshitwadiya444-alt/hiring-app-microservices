import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/forgot-password`,
        { email }
      );

      toast.success(res.data.message);
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
          Forgot Password
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Enter your registered email to reset password
        </p>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          type="submit"
        >
          Send Reset Link
        </button>

      </form>
    </div>
  );
};

export default ForgotPassword;