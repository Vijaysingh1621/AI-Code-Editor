"use client"
import { useState,useEffect } from "react"
import CodeEditor from "../components/Editor"
import { AnimatedLoader } from "../components/animated-loader"

export default function Home() {

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200) // Simulating load time
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="h-screen bg-background">
      {isLoading ? <AnimatedLoader/> :<CodeEditor /> }
    </main>
  )
}

