import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "../components/ProtectedRoute";
import { updateProfile } from "../features/auth/authSlice";
import api from "../utils/api";

const ProfileContent = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState(user || {});
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/me/", form);
      dispatch(updateProfile(data));
      setSuccess("Profile updated");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setSuccess(err.response?.data || "Failed to update");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="glass-card border border-white/60 p-6 space-y-3">
        <p className="gradient-pill w-max">Profile</p>
        <h2 className="text-2xl font-display text-charcoal">
          {user?.first_name || user?.username}
        </h2>
        <p className="text-sm text-gray-500">Role: {user?.role}</p>
        <p className="text-sm text-gray-500">Email: {user?.email}</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 glass-card border border-white/60 p-8 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              name="first_name"
              value={form.first_name || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              name="last_name"
              value={form.last_name || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address_line"
              value={form.address_line || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 h-24 bg-white"
            />
          </div>
        </div>
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button
          type="submit"
          className="rounded-2xl bg-primary text-white font-semibold px-6 py-3 shadow-card"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

const Profile = () => (
  <ProtectedRoute>
    <ProfileContent />
  </ProtectedRoute>
);

export default Profile;
