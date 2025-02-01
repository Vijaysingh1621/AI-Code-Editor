import { Code2, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">CodeCraft</span>
            </Link>
            <p className="mt-2">Empowering developers with next-gen tools</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-blue-500 transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-blue-500 transition-colors duration-200">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-blue-500 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} CodeCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

