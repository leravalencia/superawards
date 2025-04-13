import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"
import SuccessStories from "@/components/success-stories"
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Home() {
  const cookieStore = cookies()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  let currentPlan = 'free'
  
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single()
      
    if (profile?.subscription_tier) {
      currentPlan = profile.subscription_tier
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <SuccessStories />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Choose Your <span className="text-indigo-600">Plan</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Select the plan that best fits your needs
          </p>
        </div>
        <PricingSection 
          currentPlan={currentPlan} 
          isAuthenticated={!!session}
        />
        <div className="text-center mt-8">
          <Link 
            href="/pricing" 
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View detailed pricing →
          </Link>
        </div>
      </div>
      <CTASection />
      <Footer />
    </div>
  )
}

