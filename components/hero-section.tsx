import Link from "next/link"
import { Zap } from "lucide-react"

export default function HeroSection() {
  return (
    <header className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-red-600 opacity-20 blur-3xl rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute left-0 top-0 w-1/4 h-1/4 bg-red-600 opacity-10 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* AI-themed circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[1px] bg-white"></div>
          <div className="absolute top-[10%] left-[20%] w-[1px] h-[40%] bg-white"></div>
          <div className="absolute top-[50%] left-[20%] w-[30%] h-[1px] bg-white"></div>
          <div className="absolute top-[30%] left-[50%] w-[1px] h-[20%] bg-white"></div>
          <div className="absolute top-[30%] left-[50%] w-[30%] h-[1px] bg-white"></div>
          <div className="absolute top-[70%] right-[20%] w-[40%] h-[1px] bg-white"></div>
          <div className="absolute top-[30%] right-[20%] w-[1px] h-[40%] bg-white"></div>
          <div className="absolute top-[30%] right-[20%] w-[20%] h-[1px] bg-white"></div>
          {/* Data nodes */}
          <div className="absolute top-[10%] left-[20%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
          <div className="absolute top-[50%] left-[20%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
          <div className="absolute top-[30%] left-[50%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
          <div className="absolute top-[30%] right-[20%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
          <div className="absolute top-[70%] right-[20%] w-[6px] h-[6px] rounded-full bg-red-500"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              <span className="block">
                WIN <span className="text-red-600">MORE</span>
              </span>
              <span className="block">
                AWARDS WITH{" "}
                <span className="relative inline-block">
                  AI
                  <span className="absolute -top-1 -right-4">
                    <Zap className="h-6 w-6 text-red-600" />
                  </span>
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium">
              Award-AI helps you find relevant awards online and offline, and assists with submissions to increase your
              chances of winning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-12 px-8 py-3 text-lg"
              >
                Get Started for Free
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-white text-white hover:bg-white/10 h-12 px-8 py-3 text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600 rounded-lg blur-lg opacity-50"></div>
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Award-AI Platform Preview"
                className="relative rounded-lg shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

