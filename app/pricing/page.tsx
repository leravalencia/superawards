// app/pricing/page.tsx
import { Metadata } from "next"
import PricingTable from "@/components/subscription/pricing-table"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the right plan for your needs",
}

export default async function PricingPage() {
  // Get the current user's subscription tier
  const supabase = createServerComponentClient({ cookies })
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Choose Your <span className="text-indigo-600">Plan</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Select the plan that best fits your needs
        </p>
      </div>
      
      <PricingTable currentPlan={currentPlan} />
    </div>
  )
}