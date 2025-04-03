import { Search, Calendar, Send } from "lucide-react"
import SectionHeading from "./section-heading"
import FeatureCard from "./feature-card"

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Search",
      description:
        "Our AI scans thousands of award opportunities to find the perfect matches for your profile and goals.",
      icon: Search,
    },
    {
      title: "Deadline Management",
      description: "Never miss an important deadline with our smart calendar and notification system.",
      icon: Calendar,
    },
    {
      title: "Submission Assistance",
      description: "Get expert guidance on crafting winning award submissions that stand out from the competition.",
      icon: Send,
    },
  ]

  return (
    <section className="py-20 bg-white text-black">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="How Award-AI Works"
          highlight="Award-AI"
          description="Our AI-powered platform simplifies the award discovery and application process"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

