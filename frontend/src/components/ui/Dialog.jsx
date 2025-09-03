"use client"
import { motion, AnimatePresence } from "framer-motion"

const Dialog = ({ open, onOpenChange, children, title }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white text-2xl">
                  &times;
                </button>
              </div>
            )}
            <div className="text-white">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dialog
