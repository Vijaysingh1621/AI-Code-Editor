"use client"

import type React from "react"
import { motion } from "framer-motion"

const CodingLoader: React.FC = () => {
  const lines = [
    { width: "70%", delay: 0 },
    { width: "90%", delay: 0.2 },
    { width: "60%", delay: 0.4 },
    { width: "80%", delay: 0.6 },
    { width: "40%", delay: 0.8 },
    { width: "95%", delay: 1 },
  ]

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg border border-primary/10">
      <div className="space-y-3">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            className="h-2 bg-primary/20 rounded"
            initial={{ width: 0 }}
            animate={{ width: line.width }}
            transition={{
              duration: 0.8,
              delay: line.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative mt-6 h-1 bg-primary/10 rounded">
        <motion.div
          className="absolute top-0 left-0 h-full w-1/4 bg-primary rounded"
          animate={{
            x: ["0%", "300%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      </div>
    </div>
  )
}

export default CodingLoader

