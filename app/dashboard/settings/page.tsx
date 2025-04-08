// app/dashboard/settings/page.tsx
import { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageSubscription from "@/components/subscription/manage-subscription"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return <div>Please log in to access settings</div>
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  // Get subscription details
  const { data: subscription } = await supabase
    .from('active_subscriptions')
    .select('*')
    .eq('user_id', session.user.id)
    .single()
  
  // Default subscription for free tier
  const subscriptionDetails = subscription || {
    tier: profile?.subscription_tier || 'free',
    status: 'active',
    currentPeriodEnd: new Date().toISOString(),
    cancelAtPeriodEnd: false,
    amount: 0,
    currency: 'usd',
    interval: 'month'
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="subscription" className="space-y-8">
        <TabsList className="bg-gray-200 p-1 rounded-lg">
          <TabsTrigger
            value="subscription"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription">
          <div className="space-y-8">
            <ManageSubscription subscription={subscriptionDetails} />
            
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
                <CardDescription>Get more features by upgrading your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Visit our pricing page to see all available plans and upgrade options.
                </p>
                <a 
                  href="/pricing" 
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md"
                >
                  View Plans
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Profile settings form would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}