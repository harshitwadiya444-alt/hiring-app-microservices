import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4004/api/notifications/${user._id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.log(err));
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div
      className="
      sticky top-0 z-50
      bg-gradient-to-r from-[#14162e] via-[#2c2f6c] to-[#4b46a6]
      backdrop-blur-md
      border-b border-white/10
    "
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          Hire<span className="text-indigo-300">Flow</span>
        </h1>

        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-6 text-white/80">
            <li>
              <Link to="/Home" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/Browse" className="hover:text-white transition">
                Browse
              </Link>
            </li>

            <li>
              <Link to="/Jobs" className="hover:text-white transition">
                Jobs
              </Link>
            </li>

            <li>
              <Link to="/Creator" className="hover:text-white transition">
                About
              </Link>
            </li>
          </ul>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button className="bg-white/10 text-white border border-white/30 hover:bg-white/20">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6 relative">
              <div
                className="relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={22} className="text-white" />

                {notifications.length > 0 && (
                  <span
                    className="
                    absolute -top-2 -right-2
                    bg-red-500 text-white
                    text-xs rounded-full
                    px-1
                  "
                  >
                    {notifications.length}
                  </span>
                )}
              </div>

              {showNotifications && (
                <div
                  className="
                  absolute right-16 top-12
                  w-80
                  bg-gradient-to-br from-[#1e1f3f] to-[#2e2f6e]
                  border border-white/10
                  backdrop-blur-xl
                  rounded-xl
                  shadow-2xl
                  p-4
                  text-white
                  z-50
                "
                >
                  <h3 className="font-semibold text-lg mb-3 text-indigo-300">
                    Notifications
                  </h3>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-white/60">
                      No notifications yet
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="
                          p-3
                          rounded-lg
                          bg-white/5
                          border border-white/5
                          hover:bg-indigo-500/20
                          transition
                          text-sm
                          leading-relaxed
                        "
                        >
                          {n.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-indigo-400">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent
                  className="
                  w-64
                  bg-gradient-to-br from-[#1e1f3f] to-[#2e2f6e]
                  border border-white/10
                  text-white
                  shadow-2xl
                  rounded-xl
                  p-3
                  backdrop-blur-xl
                "
                >
                  <div className="flex flex-col gap-2">
                    <Link to="/Profile">
                      <button
                        className="
                        flex items-center gap-3
                        w-full px-4 py-2.5
                        rounded-lg
                        text-white font-medium
                        hover:bg-indigo-500/30
                        transition
                      "
                      >
                        <User2 size={18} className="text-indigo-300" />
                        <span className="tracking-wide">Profile</span>
                      </button>
                    </Link>

                    <div className="h-px bg-white/10 my-1"></div>

                    <button
                      onClick={logoutHandler}
                      className="
                      flex items-center gap-3
                      w-full px-4 py-2.5
                      rounded-lg
                      font-medium
                      text-red-400
                      hover:bg-red-500/20
                      transition
                    "
                    >
                      <LogOut size={18} className="text-red-400" />
                      <span className="tracking-wide">Logout</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;