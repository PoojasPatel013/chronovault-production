"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import {
  FaLock,
  FaFile,
  FaCalendar,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaVideo,
  FaClock,
  FaUpload,
  FaCheck,
} from "react-icons/fa"
import api from "./api"
import VoiceWidget from "./VoiceWidget"

const TimeCapsule = () => {
  const [title, setTitle] = useState("")
  const [memory, setMemory] = useState("")
  const [file, setFile] = useState(null)
  const [unlockDate, setUnlockDate] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [filePreview, setFilePreview] = useState("")
  const { user } = useAuth()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mov"]
      if (!validTypes.includes(selectedFile.type)) {
        setError("Only JPEG, PNG, GIF, MP4, and MOV files are allowed!")
        setFile(null)
        setFilePreview("")
        return
      }

      // Check file size
      if (selectedFile.size > 10000000) {
        // 10MB
        setError("File size must be less than 10MB")
        setFile(null)
        setFilePreview("")
        return
      }
      setFile(selectedFile)
      setError("")
      // Create preview
      if (selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile))
      } else {
        setFilePreview(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      // Validate form
      if (!title.trim()) {
        throw new Error("Title is required")
      }
      if (!memory.trim()) {
        throw new Error("Memory content is required")
      }
      if (!unlockDate) {
        throw new Error("Unlock date is required")
      }
      // Create FormData
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", memory)
      formData.append("unlockDate", unlockDate)
      formData.append("isPublic", isPublic ? "true" : "false")
      if (file) {
        formData.append("media", file)
      }
      // Make API call
      const response = await api.post("/timecapsules", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setSuccess(true)
      setTitle("")
      setMemory("")
      setFile(null)
      setUnlockDate("")
      setIsPublic(false)
      setFilePreview("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create time capsule")
      console.error("Create time capsule error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <FaClock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Create Time Capsule
            </h1>
            <p className="text-xl text-gray-400">Preserve your memories for future discovery</p>
          </motion.div>

          {/* Success/Error Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center space-x-3"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center space-x-3"
            >
              <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-300 text-sm">Time capsule created successfully!</span>
            </motion.div>
          )}

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16" />

            <form onSubmit={handleSubmit} className="relative space-y-8">
              {/* Title Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <FaFile className="w-4 h-4 text-blue-400" />
                  <span>Title</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter a title for your time capsule"
                  />
                </div>
              </div>

              {/* Memory Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <FaLock className="w-4 h-4 text-blue-400" />
                  <span>Memory</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Write your memory here... What moment do you want to preserve?"
                  />
                  <div className="absolute top-2 right-2">
                    <VoiceWidget
                      onResult={(transcript) => setMemory((prev) => prev + (prev ? " " : "") + transcript)}
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <FaImage className="w-4 h-4 text-blue-400" />
                  <span>Media (Optional)</span>
                </label>
                <div className="relative">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 bg-white/5">
                    <div className="space-y-4">
                      {filePreview ? (
                        <div className="flex flex-col items-center space-y-4">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={filePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-xl border border-white/20"
                            />
                          ) : (
                            <div className="w-32 h-32 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                              <FaVideo className="w-12 h-12 text-blue-400" />
                            </div>
                          )}
                          <p className="text-sm text-gray-400">{file.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                            <FaUpload className="w-8 h-8 text-blue-400" />
                          </div>
                          <div>
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                              Upload a file
                            </label>
                            <span className="text-gray-400"> or drag and drop</span>
                          </div>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,video/mp4,video/mov"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-gray-500">Supports: JPEG, PNG, GIF, MP4, MOV (Max 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlock Date */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <FaCalendar className="w-4 h-4 text-blue-400" />
                  <span>Unlock Date</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  {isPublic ? (
                    <FaEye className="w-4 h-4 text-blue-400" />
                  ) : (
                    <FaEyeSlash className="w-4 h-4 text-blue-400" />
                  )}
                  <span>Privacy Settings</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
                      isPublic ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-300">
                    {isPublic ? "Public - Visible to community" : "Private - Only visible to you"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Time Capsule...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Save Time Capsule
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaLock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-gray-400 text-sm">
                Your memories are safely encrypted and stored until the unlock date
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaCalendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Future Delivery</h3>
              <p className="text-gray-400 text-sm">Set any future date and receive your memories when the time comes</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaImage className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Rich Media</h3>
              <p className="text-gray-400 text-sm">
                Include photos, videos, and text to create meaningful time capsules
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default TimeCapsule
