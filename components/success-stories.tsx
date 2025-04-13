"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const successStories = [
  {
    company: "TechStart Inc.",
    industry: "Technology",
    awards: ["Best Tech Startup 2023", "Innovation Excellence Award"],
    testimonial: "Award AI helped us win two major industry awards within 6 months. The platform's AI suggestions were spot-on, and the PR exposure we received was invaluable.",
    results: "300% increase in media coverage, 45% growth in client acquisition",
    rating: 5
  },
  {
    company: "Green Solutions",
    industry: "Sustainability",
    awards: ["Environmental Excellence Award", "Green Business of the Year"],
    testimonial: "The application support feature was a game-changer. We won our first industry award within 3 months of using Award AI.",
    results: "200% increase in brand awareness, 60% growth in partnerships",
    rating: 5
  },
  {
    company: "HealthFirst",
    industry: "Healthcare",
    awards: ["Healthcare Innovation Award", "Patient Care Excellence"],
    testimonial: "The deadline management system saved us from missing several important award opportunities. The ROI has been incredible.",
    results: "150% increase in industry recognition, 35% growth in patient referrals",
    rating: 5
  }
]

export default function SuccessStories() {
  const router = useRouter()

  const handleSignup = () => {
    router.push('/auth/signup')
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how businesses like yours are achieving recognition and growth through award wins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{story.company}</CardTitle>
                    <CardDescription className="text-sm">{story.industry}</CardDescription>
                  </div>
                  <div className="flex">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 mb-2">Awards Won:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {story.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-gray-600 italic">"{story.testimonial}"</p>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm text-indigo-600 mb-1">Results Achieved:</h4>
                    <p className="text-sm text-gray-600">{story.results}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-gray-600 mb-8">
            Join hundreds of businesses that have achieved recognition and growth through award wins
          </p>
          <Button
            onClick={handleSignup}
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </section>
  )
} 