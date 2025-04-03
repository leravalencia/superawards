import Link from "next/link"
import { CheckCircle } from "lucide-react"
import SectionHeading from "./section-heading"
import AIBackground from "./ai-background"

interface PricingTierProps {
  title: string
  description: string
  price: string
  features: string[]
  ctaText: string
  ctaLink: string
  isPopular?: boolean
  variant?: "default" | "highlight" | "dark"
}

function PricingTier({
  title,
  description,
  price,
  features,
  ctaText,
  ctaLink,
  isPopular = false,
  variant = "default",
}: PricingTierProps) {
  const borderColor = {
    default: "border-gray-300",
    highlight: "border-red-600",
    dark: "border-black",
  }[variant]

  const headerBg = {
    default: "bg-gray-100",
    highlight: "bg-red-50",
    dark: "bg-gray-100",
  }[variant]

  const buttonBg = {
    default: "bg-black hover:bg-gray-800",
    highlight: "bg-red-600 hover:bg-red-700",
    dark: "bg-black hover:bg-gray-800",
  }[variant]

  const transform = isPopular ? "translate-y-[-1rem]" : ""

  return (
    <div
      className={`border-4 ${borderColor} flex flex-col shadow-xl transform transition-transform hover:scale-105 ${transform} bg-white rounded-lg overflow-hidden relative`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 text-base font-bold rounded-bl-lg rounded-tr-lg">
          POPULAR
        </div>
      )}

      <div className={`${headerBg} p-6`}>
        <h3 className="text-3xl font-black text-black">{title}</h3>
        <p className="text-lg font-medium text-gray-700">{description}</p>
        <div className="mt-6 text-4xl font-black text-black">{price}</div>
      </div>

      <div className="flex-grow p-6">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-6 w-6 text-red-600 mr-3 shrink-0 mt-0.5" />
              <span className="text-lg font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6">
        <Link
          href={ctaLink}
          className={`inline-block w-full ${buttonBg} text-white font-bold text-lg py-6 px-4 rounded-md text-center transition-colors`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  )
}

export default function PricingSection() {
  const pricingTiers = [
    {
      title: "Free",
      description: "Basic award discovery",
      price: "$0",
      features: ["Search for relevant awards", "Award announcements", "Basic filtering options"],
      ctaText: "Sign Up",
      ctaLink: "/signup",
      variant: "default" as const,
    },
    {
      title: "Premium",
      description: "Enhanced award tracking",
      price: "$19.99/month",
      features: [
        "All Free tier features",
        "Monthly newsletter with curated opportunities",
        "Personal cabinet with award calendar",
        "Deadline reminders",
      ],
      ctaText: "Get Started",
      ctaLink: "/signup?plan=premium",
      isPopular: true,
      variant: "highlight" as const,
    },
    {
      title: "Custom",
      description: "Full submission support",
      price: "Custom Pricing",
      features: [
        "All Premium tier features",
        "Advanced calendar functionality",
        "Submission management tools",
        "Personalized submission assistance",
        "Dedicated account manager",
      ],
      ctaText: "Contact Us",
      ctaLink: "/contact",
      variant: "dark" as const,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-white relative overflow-hidden">
      <AIBackground variant="light" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Choose Your Plan"
          highlight=" Plan "
          description="Select the plan that best fits your award application needs"
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

