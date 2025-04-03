import { Star } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  quote: string
  result: string
  image: string
  rating?: number
}

export default function TestimonialCard({
  name,
  role,
  company,
  quote,
  result,
  image,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl group">
      <div className="p-8 relative">
        {/* Rating */}
        <div className="flex mb-6 text-red-500">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>

        {/* Quote */}
        <div className="mb-8">
          <p className="text-xl font-bold leading-relaxed text-gray-800">"{quote}"</p>
        </div>

        {/* Client Info */}
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden mr-4 border-2 border-red-500 relative">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-600">
              {role}, {company}
            </p>
          </div>
        </div>

        {/* Result Badge */}
        <div className="absolute top-8 right-8 bg-black text-white text-sm font-bold py-1 px-3 rounded-full transform transition-transform group-hover:scale-110">
          {result}
        </div>

        {/* AI-themed accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  )
}

