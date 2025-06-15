import { Rocket } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                YC-Pilot
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">Validate Your Startup Idea for Y Combinator</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#validation" className="text-gray-600 hover:text-blue-600 transition-colors">
              Validation
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
