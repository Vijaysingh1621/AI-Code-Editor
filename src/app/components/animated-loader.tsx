"use client"

import { motion } from "framer-motion"

export const AnimatedLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-primary/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}
