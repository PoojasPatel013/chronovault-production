"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Settings, Lock, Globe, Edit2, User, Save, X, EyeOff } from "lucide-react"
import api from "./api"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    birthdate: "",
    privacy: "private",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      const data = response.data

      setUser(data.user)
      setFormData({
        name: data.user.name,
        email: data.user.email,
        gender: data.user.gender,
        birthdate: new Date(data.user.birthdate).toISOString().split("T")[0],
        privacy: data.user.privacy || "private",
      })
    } catch (error) {
      console.error("Profile error:", error)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      name: user.name,
      email: user.email,
      gender: user.gender,
      birthdate: new Date(user.birthdate).toISOString().split("T")[0],
      privacy: user.privacy || "private",
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await api.put("/auth/update-profile", formData)
      setUser(response.data.user)
      setEditing(false)
      setSuccess("Profile updated successfully!")
    } catch (error) {
      console.error("Update error:", error)
      setError("Failed to update profile")
    }
  }

  const handlePrivacyChange = (e) => {
    setFormData({ ...formData, privacy: e.target.value })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Profile Settings
            </h1>
            <p className="text-gray-400">Manage your personal information and privacy settings</p>
          </motion.div>

          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Success/Error Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3"
              >
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3"
              >
                <Save className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 text-sm">{success}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !editing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!editing}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !editing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!editing}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !editing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!editing}
                  >
                    <option value="male" className="bg-gray-800">
                      Male
                    </option>
                    <option value="female" className="bg-gray-800">
                      Female
                    </option>
                    <option value="other" className="bg-gray-800">
                      Other
                    </option>
                  </select>
                </div>

                {/* Birthdate */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !editing ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={!editing}
                  />
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border-t border-white/10 pt-6">
                <label className="block text-sm font-medium text-gray-300 mb-4">Privacy Settings</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "private", label: "Private", icon: Lock, desc: "Only visible to you" },
                    { value: "public", label: "Public", icon: Globe, desc: "Visible to everyone" },
                    { value: "anonymous", label: "Anonymous", icon: EyeOff, desc: "Hidden identity" },
                  ].map((option) => {
                    const Icon = option.icon
                    return (
                      <label
                        key={option.value}
                        className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          formData.privacy === option.value
                            ? "bg-blue-600/20 border-blue-500"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        } ${!editing ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value={option.value}
                          checked={formData.privacy === option.value}
                          onChange={handlePrivacyChange}
                          className="sr-only"
                          disabled={!editing}
                        />
                        <Icon className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <div className="font-medium text-white">{option.label}</div>
                          <div className="text-xs text-gray-400">{option.desc}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Account Settings */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Account Settings
              </h3>
              <p className="text-gray-400 text-sm mb-4">Manage your account preferences and security settings</p>
              <button
                onClick={() => navigate("/settings")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
              >
                Open Settings
              </button>
            </div>

            {/* Upgrade Plan */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Subscription
              </h3>
              <p className="text-gray-400 text-sm mb-4">Upgrade your plan to unlock premium features</p>
              <button
                onClick={() => navigate("/upgrade")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg transition-all duration-200"
              >
                Upgrade Plan
              </button>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center justify-center mx-auto"
            >
              <User className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
