"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$9",
    features: ["Intelligent Code Completion", "Syntax Highlighting", "Basic Cloud Sync", "Community Support"],
  },
  {
    name: "Pro",
    price: "$19",
    features: ["All Basic Features", "Advanced Cloud Sync", "Collaboration Tools", "Priority Support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["All Pro Features", "Custom Integrations", "Dedicated Account Manager", "24/7 Phone Support"],
  },
]

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-xl font-normal">/month</span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing

