"use client"

import { motion } from "framer-motion"
import { Code, Zap, Cloud, Lock } from "lucide-react"

const features = [
  {
    icon: <Code className="w-12 h-12 text-blue-500" />,
    title: "Intelligent Code Completion",
    description: "AI-powered suggestions to help you code faster and with fewer errors.",
  },
  {
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
    title: "Lightning-Fast Performance",
    description: "Optimized for speed, ensuring smooth coding even with large projects.",
  },
  {
    icon: <Cloud className="w-12 h-12 text-green-500" />,
    title: "Cloud Sync",
    description: "Seamlessly sync your projects across devices and collaborate in real-time.",
  },
  {
    icon: <Lock className="w-12 h-12 text-red-500" />,
    title: "Advanced Security",
    description: "Enterprise-grade security to keep your code safe and protected.",
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

