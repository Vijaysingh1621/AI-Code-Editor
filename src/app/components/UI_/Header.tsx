"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type React from "react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">CodeCraft</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#testimonials">Testimonials</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="hidden md:inline-flex">
                Log in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.nav
          className="md:hidden bg-background border-t dark:border-gray-800 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4">
            <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>
              Features
            </NavLink>
            <NavLink href="#testimonials" onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </NavLink>
            <NavLink href="#pricing" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </NavLink>
            <SignedOut>
              <SignInButton mode="modal">
                <Link href="/CodeEditor" >
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
                </Link>
              </SignInButton>
            </SignedOut>
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-primary transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
)

export default Header

