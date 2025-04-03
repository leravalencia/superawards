import Link from "next/link"
import AIBackground from "./ai-background"

export default function CTASection() {
  return (
    <section className="bg-black text-white py-20 relative overflow-hidden">
      <AIBackground variant="dark" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
          Ready to <span className="text-red-600">Win More Awards?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-medium">
          Join Award-AI today and discover opportunities perfectly matched to your profile.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-10 py-7 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  )
}

