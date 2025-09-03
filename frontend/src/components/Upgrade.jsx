"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap, Crown } from "lucide-react"
import { useAccess } from "../contexts/AccessContext"

const Upgrade = () => {
  const { access } = useAccess()

  const handleUpgrade = async (plan) => {
    try {
      const res = await fetch("/api/access/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      alert(`Successfully upgraded to ${data.access.plan.toUpperCase()}!`)
    } catch (err) {
      alert("Failed to upgrade plan.")
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: ["50 credits (1 login/day)", "Basic AI therapy sessions", "Limited chat history", "Email support"],
      icon: Star,
      current: access?.plan === "free",
      popular: false,
      buttonText: "Current Plan",
      disabled: true,
    },
    {
      name: "Basic",
      price: "$5",
      period: "month",
      description: "Great for regular users",
      features: ["12 hours/day usage", "Advanced AI therapy", "Full chat history", "Priority support", "Time capsules"],
      icon: Zap,
      current: access?.plan === "basic",
      popular: true,
      buttonText: access?.plan === "basic" ? "Current Plan" : "Upgrade to Basic",
      disabled: access?.plan === "basic",
    },
    {
      name: "Pro",
      price: "$15",
      period: "month",
      description: "For power users and professionals",
      features: [
        "Unlimited usage",
        "Premium AI models",
        "Advanced analytics",
        "24/7 priority support",
        "Export conversations",
        "Custom themes",
      ],
      icon: Crown,
      current: access?.plan === "pro",
      popular: false,
      buttonText: access?.plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      disabled: access?.plan === "pro",
    },
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Unlock the full potential of AI therapy with our flexible pricing plans designed for every need
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative bg-white/5 backdrop-blur-lg rounded-2xl border p-8 transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : plan.current
                        ? "border-green-500 shadow-lg shadow-green-500/20"
                        : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {plan.current && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.price !== "$0" && <span className="text-gray-400 ml-1">/{plan.period}</span>}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !plan.disabled && handleUpgrade(plan.name.toLowerCase())}
                    disabled={plan.disabled}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      plan.current
                        ? "bg-green-600/20 text-green-400 cursor-default"
                        : plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105"
                          : "bg-white/10 hover:bg-white/20 text-white"
                    } ${plan.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {plan.buttonText}
                  </button>
                </motion.div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I change my plan anytime?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What happens to my data?</h3>
                <p className="text-gray-400 text-sm">
                  All your conversations and progress are safely stored and accessible across all plans.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-400 text-sm">
                  The Free plan gives you a taste of our features. Upgrade anytime for full access.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How secure is my information?</h3>
                <p className="text-gray-400 text-sm">
                  We use enterprise-grade encryption and follow strict privacy standards to protect your data.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Upgrade
