import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(",") || "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully ✨");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          sm:max-w-[520px]
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-2xl
          text-white
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-200">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">Full Name</Label>
              <input
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="
                  bg-white/10 text-white
                  border border-white/20
                  rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">Email</Label>
              <input
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="
                  bg-white/10 text-white
                  border border-white/20
                  rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">Phone</Label>
              <input
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="
                  bg-white/10 text-white
                  border border-white/20
                  rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">Bio</Label>
              <input
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="
                  bg-white/10 text-white
                  border border-white/20
                  rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">
                Skills (comma separated)
              </Label>
              <input
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="react,node,mongodb"
                className="
                  bg-white/10 text-white
                  border border-white/20
                  rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* ✅ Custom Resume Upload (No white button) */}
            <div className="flex flex-col gap-1">
              <Label className="text-indigo-200">Resume (PDF)</Label>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="resume"
                  className="
                    cursor-pointer
                    bg-white/10 text-indigo-300
                    border border-white/20
                    px-4 py-2 rounded-lg
                    hover:bg-white/20
                    transition
                  "
                >
                  Choose File
                </label>

                <span className="text-sm text-gray-400 truncate">
                  {input.file ? input.file.name : "No file selected"}
                </span>

                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700
                text-white font-semibold
                rounded-xl
              "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
