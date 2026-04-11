import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import socket from "./socket";
import { setUser } from "./redux/authSlice";

import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import Register from "./components/component_lite/Register";
import Login from "./components/component_lite/Login";
import Home from "./components/component_lite/Home";
import Jobs from "./components/component_lite/Jobs";
import Browse from "./components/component_lite/Browse";

import ProtectedRoute from "./components/admincomponent/ProtectedRoute";
import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import Description from "./components/component_lite/Description";
import Profile from "./components/component_lite/Profile";
import RecruiterDashboardWrapper from "./components/component_lite/RecruiterDashboardWrapper";
import UpdateJob from "./components/admincomponent/Updatejob";
import AuditLogPage from "./components/admincomponent/AuditLogs";

/* ----------------------------------
   GLOBAL AXIOS CONFIG
---------------------------------- */

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

function App() {

  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  // console.log("Redux User:", user);

  /* ----------------------------------
     LOAD USER ON PAGE REFRESH
  ---------------------------------- */

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await axios.get("http://localhost:4001/api/users/me");

        console.log("ME API RESPONSE:", res.data);

        dispatch(setUser(res.data.user));

      } catch (err) {

        console.log("User not logged in");

      }

    };

    loadUser();

  }, [dispatch]);

  /* ----------------------------------
     SOCKET CONNECTION
  ---------------------------------- */

  useEffect(() => {

    if (!user) return;

    socket.emit("register", user._id);

    const handleNotification = (data) => {

      console.log("Notification received:", data);

      alert(data.message);

    };

    socket.on("notification", handleNotification);

    return () => {

      socket.off("notification", handleNotification);

    };

  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/80 to-purple-900/80 text-gray-100">

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/browse" element={<Browse />} />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/companies/create"
          element={
            <ProtectedRoute>
              <CompanyCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute>
              <CompanySetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <AdminJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* JOB DESCRIPTION */}

        <Route path="/description/:id" element={<Description />} />

        {/* PROFILE */}

        <Route path="/profile" element={<Profile />} />

        {/* RECRUITER DASHBOARD */}

        <Route
          path="/recruiter/dashboard/:jobId"
          element={<RecruiterDashboardWrapper />}
        />

        {/* UPDATE JOB */}

        <Route
          path="/admin/jobs/update/:id"
          element={<UpdateJob />}
        />

        {/* AUDIT LOG */}

        <Route
          path="/applications/:id/audit-log"
          element={<AuditLogPage />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>

    </div>
  );
}

export default App;