import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-black text-center transform transition-transform hover:scale-105">
      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-black">{title}</h3>
      <p className="text-gray-700 font-medium">{description}</p>
    </div>
  )
}

