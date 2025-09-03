"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import {
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  SettingsIcon,
  LogOut,
  Calendar,
  Mail,
} from "lucide-react"

const Settings = () => {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`)
      const data = await response.json()
      setProfile(data)
      setFormData({
        username: data.username,
        email: data.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch profile")
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              .split("=")[1]
          }`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile(data)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              .split("=")[1]
          }`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to change password")
      }

      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setSuccess("Password changed successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      setError("Failed to logout")
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "account", label: "Account", icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-gray-400">Manage your account preferences and security settings</p>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3 max-w-4xl mx-auto"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3 max-w-4xl mx-auto"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 text-sm">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setError("")
                          setSuccess("")
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
                  >
                    <div className="flex items-center mb-6">
                      <User className="w-6 h-6 text-blue-400 mr-3" />
                      <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    </div>

                    <form onSubmit={updateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your username"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Updating..." : "Update Profile"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
                  >
                    <div className="flex items-center mb-6">
                      <Lock className="w-6 h-6 text-blue-400 mr-3" />
                      <h2 className="text-2xl font-bold text-white">Change Password</h2>
                    </div>

                    <form onSubmit={changePassword} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-500" />
                          </div>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                            ) : (
                              <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                              ) : (
                                <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                              ) : (
                                <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                          <li>• Include at least one special character</li>
                        </ul>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {loading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Account Information */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                      <div className="flex items-center mb-6">
                        <Shield className="w-6 h-6 text-blue-400 mr-3" />
                        <h2 className="text-2xl font-bold text-white">Account Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <User className="w-5 h-5 text-blue-400 mr-2" />
                            <h3 className="text-lg font-semibold text-white">Account Type</h3>
                          </div>
                          <p className="text-gray-400">Standard User</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                            <h3 className="text-lg font-semibold text-white">Member Since</h3>
                          </div>
                          <p className="text-gray-400">
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                          to="/profile"
                          className="flex items-center p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        >
                          <User className="w-5 h-5 text-blue-400 mr-3" />
                          <div>
                            <div className="font-medium text-white">Edit Profile</div>
                            <div className="text-sm text-gray-400">Update your personal information</div>
                          </div>
                        </Link>

                        <Link
                          to="/upgrade"
                          className="flex items-center p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        >
                          <Shield className="w-5 h-5 text-blue-400 mr-3" />
                          <div>
                            <div className="font-medium text-white">Upgrade Plan</div>
                            <div className="text-sm text-gray-400">Access premium features</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                      <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
                      <p className="text-gray-400 mb-6">
                        Once you sign out, you'll need to sign in again to access your account.
                      </p>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
