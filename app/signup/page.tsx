"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")

  const [selectedPlan, setSelectedPlan] = useState(planParam || "free")

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Create Your <span className="text-red-600">Award-AI</span> Account
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Start discovering award opportunities tailored to your profile
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Enter your details to sign up for Award-AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your password" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Create Account</Button>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Selected Plan</h2>

          <div className="space-y-4">
            <PlanOption
              title="Free"
              price="$0"
              description="Basic award discovery"
              features={["Search for relevant awards", "Award announcements", "Basic filtering options"]}
              isSelected={selectedPlan === "free"}
              onClick={() => setSelectedPlan("free")}
            />

            <PlanOption
              title="Premium"
              price="$19.99/month"
              description="Enhanced award tracking"
              features={[
                "All Free tier features",
                "Monthly newsletter with curated opportunities",
                "Personal cabinet with award calendar",
                "Deadline reminders",
              ]}
              isSelected={selectedPlan === "premium"}
              onClick={() => setSelectedPlan("premium")}
              isPopular
            />

            <PlanOption
              title="Custom"
              price="Custom Pricing"
              description="Full submission support"
              features={[
                "All Premium tier features",
                "Advanced calendar functionality",
                "Submission management tools",
                "Personalized submission assistance",
                "Dedicated account manager",
              ]}
              isSelected={selectedPlan === "custom"}
              onClick={() => setSelectedPlan("custom")}
            />
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-red-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-red-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PlanOptionProps {
  title: string
  price: string
  description: string
  features: string[]
  isSelected: boolean
  onClick: () => void
  isPopular?: boolean
}

function PlanOption({ title, price, description, features, isSelected, onClick, isPopular }: PlanOptionProps) {
  return (
    <div
      className={`border-3 rounded-lg p-6 cursor-pointer transition-all shadow-lg ${
        isSelected ? "border-red-600 bg-red-50 transform scale-105" : "border-gray-300 hover:border-red-400"
      } ${isPopular ? "relative" : ""}`}
      onClick={onClick}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 text-sm font-bold rounded-bl-lg rounded-tr-lg">
          POPULAR
        </div>
      )}

      <div className="flex items-start gap-5">
        <div
          className={`w-6 h-6 rounded-full border-3 mt-1 flex-shrink-0 ${
            isSelected ? "border-red-600 bg-red-600" : "border-gray-400"
          }`}
        >
          {isSelected && <CheckCircle className="text-white w-5 h-5" />}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl">{title}</h3>
            <div className="font-extrabold text-xl">{price}</div>
          </div>

          <p className="text-gray-700 text-base mb-4">{description}</p>

          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-base">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

