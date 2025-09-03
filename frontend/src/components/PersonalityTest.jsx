"use client"

import { useState, useEffect, useContext } from "react"
import api from "./api"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { FaChevronRight, FaChevronLeft, FaFire, FaBrain, FaCheckCircle } from "react-icons/fa"
import { ThemeContext } from "../contexts/ThemeContext"

export default function PersonalityTest() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      const response = await api.get("/personality/questions")
      if (response.data && Array.isArray(response.data)) {
        setQuestions(response.data)
      } else {
        console.error("Invalid questions data format:", response.data)
        throw new Error("Invalid questions data format")
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      if (error.response?.status === 401) {
        navigate("/login")
      } else {
        alert("Failed to load personality questions. Please try again later.")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ensure we have all questions answered
      if (!answers || answers.length !== questions.length) {
        throw new Error("Please answer all questions")
      }

      // Format the answers array
      const formattedAnswers = answers.map((answer, index) => {
        // If answer is undefined or invalid, default to first option (index 0)
        if (
          answer === undefined ||
          typeof answer !== "number" ||
          answer < 0 ||
          answer >= questions[index].options.length
        ) {
          return 0 // Default to first option
        }
        return Number.parseInt(answer) // Ensure we're sending a number
      })

      const response = await api.post("/personality/calculate", { answers: formattedAnswers })
      const resultData = response.data
      navigate("/personality-result", { state: { result: resultData } })
    } catch (error) {
      console.error("Error calculating personality:", error)
      alert(error.response?.data?.message || "Failed to calculate personality type. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const getCompletionPercentage = () => {
    if (questions.length === 0) return 0
    const answeredQuestions = answers.filter((answer) => answer !== undefined).length
    return Math.round((answeredQuestions / questions.length) * 100)
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
              <FaBrain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Personality Assessment
            </h1>
            <p className="text-xl text-gray-400 mb-6">Discover your unique personality traits and strengths</p>

            {/* Progress Bar */}
            {questions.length > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm text-blue-400 font-medium">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Start Button */}
          {!questions.length && (
            <div className="text-center">
              <motion.button
                onClick={fetchQuestions}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-semibold text-xl tracking-wide transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <FaBrain className="mr-3" />
                Begin Your Journey
              </motion.button>
            </div>
          )}

          {/* Questions */}
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
            >
              {/* Question number indicator */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 text-sm font-bold">{index + 1}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white leading-relaxed pt-2">{question.text}</h3>
                </div>

                <div className="space-y-3 ml-16">
                  {question.options.map((option, optionIndex) => (
                    <motion.label
                      key={optionIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + optionIndex * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                        answers[index] === optionIndex
                          ? "bg-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/10"
                          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={answers[index] === optionIndex}
                          onChange={(e) => handleAnswerChange(index, Number.parseInt(e.target.value))}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                            answers[index] === optionIndex
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-500 group-hover:border-blue-400"
                          }`}
                        >
                          {answers[index] === optionIndex && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center"
                            >
                              <FaCheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <span className="text-white font-medium group-hover:text-blue-100 transition-colors">
                          {option.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            answers[index] === optionIndex
                              ? "bg-blue-500 text-white"
                              : "bg-white/10 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-300"
                          }`}
                        >
                          {option.dimension}
                        </span>
                        <span className="text-gray-400 text-sm font-medium">{option.weight} pts</span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Submit Section */}
          {questions.length > 0 && (
            <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Completion Status */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <span className="text-gray-400">Questions completed:</span>
                    <span className="text-blue-400 font-bold">
                      {answers.filter((answer) => answer !== undefined).length} / {questions.length}
                    </span>
                  </div>
                </div>

                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/30 min-w-[200px]"
                  >
                    <FaChevronLeft className="mr-2" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || answers.filter((answer) => answer !== undefined).length !== questions.length}
                    className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-105 disabled:hover:scale-100 min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <FaFire className="mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <FaChevronRight className="mr-2" />
                        Reveal Your Personality
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
