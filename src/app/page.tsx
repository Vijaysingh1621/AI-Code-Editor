import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/UI_/Header"
import Features from "./components/UI_/Features"
import Testimonials from "./components/UI_/Testimonials"
import Pricing from "./components/UI_/Pricing"
import Footer from "./components/UI_/Footer"
import Hero from "./components/UI_/Hero"
import AnimatedBackground from "./components/UI_/AnimatedBackground"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <AnimatedBackground />
        <Header />
        <main>
          <Hero />
          <Features />
          <Testimonials />
          <Pricing />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

