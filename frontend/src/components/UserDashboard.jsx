"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Lock, CreditCard, Edit, Eye, Clock, Shield, Brain, Quote, Star, Lightbulb, Heart } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import api from "../components/api"

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [privacyOption, setPrivacyOption] = useState("private")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentQuote, setCurrentQuote] = useState(0)
  const { user } = useAuth()
  const [access, setAccess] = useState({
  plan: "free",       // "free" | "basic" | "pro"
  credits: 30,        // only relevant for free plan
  dailyUsage: 120,    // minutes used today (for basic plan)
})
  const inspirationalQuotes = [
    {
      text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
      author: "William James",
    },
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer",
    },
    {
      text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
      author: "Julian Seifter",
    },
    {
      text: "Healing takes time, and asking for help is a courageous step.",
      author: "Mariska Hargitay",
    },
    {
      text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Anonymous",
    },
    {
      text: "It's okay to not be okay. It's not okay to stay that way.",
      author: "Anonymous",
    },
  ]

  const dailyAffirmations = [
    "I am worthy of love and respect",
    "I choose peace over worry",
    "I am growing stronger every day",
    "I trust in my ability to overcome challenges",
    "I am exactly where I need to be",
    "I deserve happiness and inner peace",
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 10000) // Change quote every 10 seconds
    return () => clearInterval(quoteTimer)
  }, [])

  useEffect(() => {
    const fetchDetails = async () => {
      if (user) {
        try {
          const [capsuleRes, profileRes] = await Promise.all([
            api.get("/users/time-capsules"),
            api.get("/auth/profile"),
          ])

          const capsuleData = capsuleRes.data
          const profileData = profileRes.data

          setUserProfile({
            name: profileData.user.name,
            email: profileData.user.email,
            lastLogin: new Date().toISOString(),
            timeCapsules: capsuleData?.data?.length || 0,
          })
        } catch (err) {
          console.error("Failed to load dashboard data", err)
        }
      }
    }

    fetchDetails()
  }, [user])

  const handlePrivacyChange = async (option) => {
    try {
      setPrivacyOption(option)
      const response = await api.post("/settings/privacy", {
        privacyOption: option,
      })
      console.log("Privacy updated:", response.data.message)
    } catch (error) {
      console.error("Failed to update privacy:", error)
    }
  }

  const upgradePlan = (newPlan) => {
  if (newPlan === "basic") {
    setAccess({ plan: "basic", credits: 0, dailyUsage: 0 })
  } else if (newPlan === "pro") {
    setAccess({ plan: "pro", credits: null, dailyUsage: null })
  } else {
    setAccess({ plan: "free", credits: 50, dailyUsage: 0 })
  }
}


  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Evening"
  }

  const todaysAffirmation = dailyAffirmations[new Date().getDay()]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background decoration - Blue theme only */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-pulse"></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-6 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              {getGreeting()}, {userProfile.name}
            </h1>
            <p className="text-xl text-gray-300 mb-2">Welcome to your mental wellness dashboard</p>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </motion.div>

          {/* Inspirational Quote Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16" />

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-8 h-8 text-white" />
              </div>

              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <blockquote className="text-xl md:text-2xl font-medium text-gray-200 italic leading-relaxed max-w-4xl mx-auto">
                  &quot;{inspirationalQuotes[currentQuote].text}&quot;
                </blockquote>
                <cite className="text-blue-400 font-semibold">— {inspirationalQuotes[currentQuote].author}</cite>
              </motion.div>

              <div className="flex justify-center mt-6 space-x-2">
                {inspirationalQuotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuote(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuote ? "bg-blue-400 w-8" : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Overview - Only real data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Time Capsules</p>
                  <p className="text-3xl font-bold text-white mt-1">{userProfile.timeCapsules}</p>
                  <p className="text-xs text-blue-400 mt-1">Memories preserved</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Days With Us</p>
                  <p className="text-3xl font-bold text-white mt-1">{membershipDays}</p>
                  <p className="text-xs text-blue-400 mt-1">Your journey</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Plan Status</p>
                  <p className="text-2xl font-bold text-white mt-1 capitalize">{access?.plan || "Free"}</p>
                  <p className="text-xs text-blue-400 mt-1">Current tier</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Daily Affirmation */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full translate-y-20 -translate-x-20" />

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Today&apos;s Affirmation</h3>
              <p className="text-xl text-gray-200 font-medium italic">&quot;{todaysAffirmation}&quot;</p>
              <p className="text-sm text-gray-400 mt-4">Take a moment to reflect on this positive thought</p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-12">
            {/* Profile Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.6 }}
              className="xl:col-span-2 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16" />

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Profile</h2>
                      <p className="text-gray-400">Your personal information</p>
                    </div>
                  </div>
                  <Link to="/profile" className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group">
                    <Edit className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </Link>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-gray-400 font-medium">Name</span>
                    <span className="text-white font-semibold">{userProfile.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-gray-400 font-medium">Email</span>
                    <span className="text-white font-semibold">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-gray-400 font-medium">Status</span>
                    <span className="text-blue-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Plan Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.7 }}
              className="xl:col-span-3 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full translate-y-20 -translate-x-20" />

              <div className="relative">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Plan</h2>
                    <p className="text-gray-400">Subscription details</p>
                  </div>
                </div>

                              
              <div className="flex flex-col justify-center space-y-4">
                {access.plan !== "pro" ? (
                  <>
                    <button
                      onClick={() => upgradePlan("basic")}
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Upgrade to Basic
                    </button>

                    <button
                      onClick={() => upgradePlan("pro")}
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Upgrade to Pro
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                    <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-400 font-semibold">Premium Member (Pro)</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </div>

          {/* Privacy Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 -translate-x-32" />

            <div className="relative">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
                  <p className="text-gray-400">Control how your profile appears to others</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    option: "public",
                    icon: Eye,
                    label: "Public",
                    desc: "Visible to everyone",
                  },
                  {
                    option: "private",
                    icon: Lock,
                    label: "Private",
                    desc: "Only visible to you",
                  },
                  {
                    option: "anonymous",
                    icon: User,
                    label: "Anonymous",
                    desc: "Hidden identity",
                  },
                ].map(({ option, icon: Icon, label, desc }) => (
                  <button
                    key={option}
                    onClick={() => handlePrivacyChange(option)}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      privacyOption === option
                        ? "bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/25"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold text-white text-lg mb-2">{label}</div>
                      <div className="text-sm text-gray-400">{desc}</div>
                      {privacyOption === option && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              to="/profile"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Edit className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Edit Profile
            </Link>
            <button className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              <Clock className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              View Time Capsules
            </button>
            <Link
              to="/ai-therapy"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Brain className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              AI Therapy
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
