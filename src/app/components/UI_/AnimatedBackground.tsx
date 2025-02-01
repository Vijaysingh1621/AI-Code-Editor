"use client"

import { useEffect, useRef } from "react"
import { Code2, Database, Globe, Cpu, Cloud } from "lucide-react"

const icons = [Code2, Database, Globe, Cpu, Cloud]

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createIcon = () => {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)]
      const icon = document.createElement("div")
      icon.style.position = "absolute"
      icon.style.left = `${Math.random() * 100}%`
      icon.style.top = `${Math.random() * 100}%`
      icon.style.opacity = "0.1"
      icon.style.transform = `scale(${Math.random() * 0.5 + 0.5})`

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", "24")
      svg.setAttribute("height", "24")
      svg.setAttribute("viewBox", "0 0 24 24")
      svg.setAttribute("fill", "none")
      svg.setAttribute("stroke", "currentColor")
      svg.setAttribute("stroke-width", "2")
      svg.setAttribute("stroke-linecap", "round")
      svg.setAttribute("stroke-linejoin", "round")

      const IconSvg = <IconComponent />
      if (IconSvg.props && IconSvg.props.children) {
        svg.innerHTML = IconSvg.props.children
      }

      icon.appendChild(svg)
      container.appendChild(icon)

      setTimeout(() => {
        icon.remove()
      }, 10000)
    }

    const interval = setInterval(createIcon, 1000)

    return () => clearInterval(interval)
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" />
}

export default AnimatedBackground

