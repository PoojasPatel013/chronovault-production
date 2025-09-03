"use client"

import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { FaStar, FaLightbulb, FaMoon, FaSun, FaBrain, FaTrophy, FaChartBar } from "react-icons/fa"
import { ThemeContext } from "../contexts/ThemeContext"

const PersonalityResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state?.result
  const { theme, toggleTheme } = React.useContext(ThemeContext)

  useEffect(() => {
    // If no result is available, redirect to personality test
    if (!result) {
      navigate("/personality-test")
    }
  }, [navigate, result])

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-12 rounded-2xl shadow-2xl text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBrain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Discovering Your Personality...</h2>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
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
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 container mx-auto px-4 py-16"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaTrophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Your Personality Profile
              </h1>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                  {result.type}
                </h2>
                <p className="text-2xl text-gray-300 font-medium italic">{result.name}</p>
              </div>
            </motion.div>
          </div>

          {/* Dimension Scores */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <FaChartBar className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Dimension Scores</h3>
                </div>
                {/* <button
                  onClick={() => toggleTheme()}
                  className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-blue-500/30"
                >
                  {theme === "dark" ? (
                    <FaSun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <FaMoon className="w-5 h-5 text-blue-400" />
                  )}
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(result.scores).map(([dimension, score], index) => (
                  <motion.div
                    key={dimension}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">{dimension}</span>
                      <span className="text-2xl font-bold text-blue-400">{score}%</span>
                    </div>
                    <div className="relative bg-gray-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Personality Details */}
          <div className="space-y-8 mb-16">
            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16" />

              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <FaBrain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Personality Type</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 text-center">
                    <span className="text-4xl font-bold text-blue-400">{result.type}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-xl font-semibold text-white mb-4">Description</h4>
                    <p className="text-lg text-gray-300 leading-relaxed">{result.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Traits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <FaStar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Key Traits</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.traits.map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <FaStar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Trait {index + 1}</h4>
                        <p className="text-gray-300 leading-relaxed">{trait}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Return Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold text-xl tracking-wide transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
            >
              <FaLightbulb className="mr-3" />
              Return to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PersonalityResult
