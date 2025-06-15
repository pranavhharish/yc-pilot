import { ArrowRight, CheckCircle } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="text-center py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Get Your Startup Idea
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
            YC-Ready
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Our AI-powered validation tool analyzes your startup idea against Y Combinator's criteria, providing detailed
          feedback to help you build a fundable company.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Comprehensive Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">YC Partner Insights</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Actionable Feedback</span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to validate your idea?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of founders who've used YC-Pilot to refine their startup concepts
          </p>
          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-blue-600 animate-bounce" />
            <span className="ml-2 text-blue-600 font-medium">Start validation below</span>
          </div>
        </div>
      </div>
    </section>
  )
}
