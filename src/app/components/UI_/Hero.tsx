"use client"

import { motion } from "framer-motion"
import { ArrowRight, Code2 } from "lucide-react"
import Link from "next/link"

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Craft Your Code with <span className="text-blue-500">Precision</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Experience the next level of coding with our advanced editor
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SignedOut>
          <SignInButton>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-colors duration-200"
          >
            Get Started <ArrowRight className="ml-2" />
          </Link>
          </SignInButton>
          
          </SignedOut>
          <SignedIn>
           
          <Link
            href="/CodeEditor"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-colors duration-200"
          >
            Start coding <ArrowRight className="ml-2" />
          </Link>
          </SignedIn>
        </motion.div>
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-2xl inline-block">
            <Code2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <pre className="text-left text-sm">
              <code className="language-javascript">
                {`function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('CodeCraft User');`}
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

