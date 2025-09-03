"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { User, LogOut, Settings, UserCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`block text-lg md:text-sm font-medium transition-all duration-300 relative group ${
          isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {children}
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        {/* Hover effect */}
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Link>
    </motion.div>
  )
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsSidebarOpen(false)
    navigate("/")
  }

  const headerVariants = {
    hidden: { y: -100 },
    visible: { y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  }

  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  }

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "py-2 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "py-4 bg-transparent"
        }`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative group">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ChronoVault
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-6">
                    <NavLink to="/time-capsule">Time Capsule</NavLink>
                    <NavLink to="/community">Community</NavLink>
                    <NavLink to="/personality-test">Personality Test</NavLink>
                    <NavLink to="/ai-therapy">AI Therapy</NavLink>
                    <NavLink to="/book-session">Book Session</NavLink>
                  </div>

                  {/* User Menu */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="group flex items-center space-x-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-white font-medium">{user?.name || user?.username}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-6 py-2 text-white hover:text-blue-400 font-medium transition-all duration-300 relative group"
                  >
                    Sign In
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-blue-400 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="space-y-3">
                      <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </NavLink>
                      <NavLink to="/time-capsule" onClick={() => setIsOpen(false)}>
                        Time Capsule
                      </NavLink>
                      <NavLink to="/community" onClick={() => setIsOpen(false)}>
                        Community
                      </NavLink>
                      <NavLink to="/personality-test" onClick={() => setIsOpen(false)}>
                        Personality Test
                      </NavLink>
                      <NavLink to="/ai-therapy" onClick={() => setIsOpen(false)}>
                        AI Therapy
                      </NavLink>
                      <NavLink to="/book-session" onClick={() => setIsOpen(false)}>
                        Book Session
                      </NavLink>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          setIsSidebarOpen(true)
                        }}
                        className="flex items-center justify-center w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium">Account ({user?.name})</span>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 space-y-4">
                    <Link
                      to="/login"
                      className="block w-full px-6 py-3 text-center text-white border border-white/20 hover:border-blue-500/50 rounded-xl hover:bg-white/5 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-6 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* User Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && isAuthenticated && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 text-white shadow-2xl z-50"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            </div>

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Account
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <p className="text-lg font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6 space-y-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/5 group-hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/5 group-hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>

                <Link
                  to="/my-timecapsules"
                  className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/5 group-hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">My Time Capsules</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="w-10 h-10 bg-white/5 group-hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Settings</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-red-500/10 group-hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
