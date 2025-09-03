"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "./api"
import { motion, AnimatePresence } from "framer-motion"
import { FaLock, FaUnlock, FaCalendarAlt, FaHourglassHalf, FaBoxOpen, FaTimesCircle, FaFile } from "react-icons/fa"

const PrivateTimeCapsules = () => {
  const { user } = useAuth()
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCapsule, setSelectedCapsule] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)

  useEffect(() => {
    const fetchPrivateCapsules = async () => {
      try {
        const res = await api.get("/timecapsules/private")
        setCapsules(res.data.data)
      } catch (err) {
        console.error("Error fetching private capsules:", err)
        setError("Failed to load your private time capsules.")
      } finally {
        setLoading(false)
      }
    }
    fetchPrivateCapsules()
  }, [])

  const handleViewContent = (capsule) => {
    setSelectedCapsule(capsule)
    setShowContentModal(true)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FaHourglassHalf className="w-10 h-10 text-white" />
          </div>
          <p className="text-white text-lg">Loading your time capsules...</p>
        </motion.div>
      </div>
    )
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FaBoxOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Your Private Time Capsules
          </h1>
          <p className="text-xl text-gray-400">Memories waiting to be unlocked</p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center space-x-3"
          >
            <FaTimesCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && capsules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBoxOpen className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No private time capsules found</h3>
            <p className="text-gray-400">Start creating your first time capsule to preserve your memories!</p>
          </motion.div>
        )}

        {/* Capsules List */}
        <div className="space-y-6">
          <AnimatePresence>
            {capsules.map((capsule, index) => {
              const isUnlocked = new Date(capsule.unlockDate) <= new Date()
              return (
                <motion.div
                  key={capsule._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">{capsule.title}</h2>
                      {isUnlocked ? (
                        <div className="flex items-center space-x-2 text-green-400">
                          <FaUnlock className="w-5 h-5" />
                          <span className="font-medium">Unlocked</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <FaLock className="w-5 h-5" />
                          <span className="font-medium">Locked</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 flex items-center space-x-2 mb-4">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>Unlock Date: {new Date(capsule.unlockDate).toLocaleString()}</span>
                    </p>

                    {isUnlocked ? (
                      <div className="space-y-4">
                        <p className="text-gray-300 leading-relaxed">{capsule.content}</p>
                        {capsule.mediaUrl && (
                          <div className="mt-4">
                            {capsule.mediaType?.startsWith("image/") ? (
                              <img
                                src={capsule.mediaUrl || "/placeholder.svg"}
                                alt="Capsule Media"
                                className="w-full h-auto max-h-64 object-cover rounded-lg border border-white/10"
                              />
                            ) : capsule.mediaType?.startsWith("video/") ? (
                              <video
                                src={capsule.mediaUrl}
                                controls
                                className="w-full h-auto max-h-64 object-cover rounded-lg border border-white/10"
                              />
                            ) : (
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center space-x-3">
                                <FaFile className="w-6 h-6 text-blue-400" />
                                <span className="text-gray-300">Attached File: {capsule.fileName || "Unknown"}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => handleViewContent(capsule)}
                          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          View Full Content
                        </button>
                      </div>
                    ) : (
                      <p className="mt-2 italic text-gray-500">
                        This time capsule is locked. It will be revealed on the unlock date.
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Modal */}
      <AnimatePresence>
        {showContentModal && selectedCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowContentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedCapsule.title}</h2>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimesCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-400 flex items-center space-x-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Unlocked on: {new Date(selectedCapsule.unlockDate).toLocaleString()}</span>
                </p>
                <p className="text-gray-300 leading-relaxed">{selectedCapsule.content}</p>

                {selectedCapsule.mediaUrl && (
                  <div className="mt-4">
                    {selectedCapsule.mediaType?.startsWith("image/") ? (
                      <img
                        src={selectedCapsule.mediaUrl || "/placeholder.svg"}
                        alt="Capsule Media"
                        className="w-full h-auto max-h-96 object-contain rounded-lg border border-white/10"
                      />
                    ) : selectedCapsule.mediaType?.startsWith("video/") ? (
                      <video
                        src={selectedCapsule.mediaUrl}
                        controls
                        className="w-full h-auto max-h-96 object-contain rounded-lg border border-white/10"
                      />
                    ) : (
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center space-x-3">
                        <FaFile className="w-6 h-6 text-blue-400" />
                        <span className="text-gray-300">Attached File: {selectedCapsule.fileName || "Unknown"}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PrivateTimeCapsules
