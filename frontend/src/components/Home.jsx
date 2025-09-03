"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useScroll, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ldqo59BGwhjTn28WjwG4E9fPEqKoTa.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mWtFMQE3sNaHXjf6W3370yeD9TR2wP.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TXirYyTOoevQl5m4BTepLM1o9iBDsY.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qrLkgC7ZViupyEMAvpCT5rAlN1rzzd.png",
]

const Home = () => {
  const navigate = useNavigate()
  const controls = useAnimation()
  const ref = useRef(null)
  const { isAuthenticated, user } = useAuth()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black text-text-light-primary dark:text-text-dark-primary">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
            <motion.div
              className="absolute inset-0 flex"
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {[...images, ...images].map((src, index) => (
                <div key={index} className="relative min-w-[200px] h-full flex-shrink-0">
                  <img src={src || "/placeholder.svg"} alt="Memory" className="h-full w-full object-cover opacity-40" />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-7xl font-bold mb-6 bg-clip-text "
          >
            {isAuthenticated ? `Welcome back, ${user?.name}` : "Preserve Your Journey"}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl mb-12 text-text-light-secondary dark:text-text-dark-secondary">
            {isAuthenticated
              ? "Continue your journey of memories and mental well-being"
              : "A digital sanctuary for your memories and mental well-being"}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/community")}
                  className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-all"
                >
                  Explore Community
                </button>
                <button
                  onClick={() => navigate("/time-capsule")}
                  className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all"
                >
                  Create Time Capsule
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-all"
                >
                  Start Your Journey
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all"
                >
                  Sign In
                </button>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section ref={ref} style={{ opacity }} className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div style={{ y }} className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">AI-Powered Therapy</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Experience personalized mental wellness support through our advanced AI therapy sessions. Available
                24/7, completely confidential, and tailored to your needs.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? "/ai-therapy" : "/signup")}
                className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-all w-full"
              >
                {isAuthenticated ? "Start AI Therapy" : "Sign Up to Access"}
              </button>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Digital Time Capsule</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Create and preserve your most precious memories in our secure digital vault. Share your journey with
                future you or connect with others on similar paths.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? "/time-capsule" : "/signup")}
                className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all w-full"
              >
                {isAuthenticated ? "Create Time Capsule" : "Sign Up to Access"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home