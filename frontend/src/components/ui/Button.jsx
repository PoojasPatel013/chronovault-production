"use client"

const Button = ({ children, className = "", onClick, variant = "default", disabled = false, type = "button" }) => {
  const baseStyles =
    "px-4 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border-2 border-white text-white hover:bg-white/10 focus:ring-white",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  }

  const disabledStyles = "opacity-50 cursor-not-allowed"

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
