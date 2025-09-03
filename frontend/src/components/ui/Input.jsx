"use client"

const Input = ({
  type = "text",
  placeholder = "",
  className = "",
  value,
  onChange,
  required = false,
  disabled = false,
  id,
  name,
}) => {
  const baseStyles =
    "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
  const disabledStyles = "opacity-50 cursor-not-allowed bg-gray-100"

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${baseStyles} ${disabled ? disabledStyles : ""} ${className}`}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      id={id}
      name={name}
    />
  )
}

export default Input
