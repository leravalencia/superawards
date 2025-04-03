import Link from "next/link"
import TestimonialCard from "./testimonial-card"
import SectionHeading from "./section-heading"
import AIBackground from "./ai-background"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechStart Inc.",
      quote:
        "Award-AI helped us identify and win the Tech Innovation Award, significantly boosting our company's visibility.",
      result: "Won Tech Innovation Award",
      image: "/placeholder.svg?height=56&width=56",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "EcoSolutions",
      quote:
        "The calendar and deadline management features saved us countless hours. We applied for 3 awards and won 2!",
      result: "67% Success Rate",
      image: "/placeholder.svg?height=56&width=56",
    },
    {
      name: "Jessica Rodriguez",
      role: "Founder",
      company: "CreativeMinds Agency",
      quote:
        "The submission assistance was game-changing. Award-AI helped us craft compelling applications that truly stood out.",
      result: "Design Excellence Award",
      image: "/placeholder.svg?height=56&width=56",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <AIBackground variant="light" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="What Our Clients Say"
          highlight=" Clients "
          description="Discover how Award-AI has helped organizations win prestigious awards"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/testimonials"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold text-lg px-8 py-4 rounded-lg transition-transform hover:scale-105"
          >
            Read More Success Stories
          </Link>
        </div>
      </div>
    </section>
  )
}

