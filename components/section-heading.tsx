interface SectionHeadingProps {
  title: string
  highlight?: string
  description: string
}

export default function SectionHeading({ title, highlight, description }: SectionHeadingProps) {
  const titleParts = highlight ? title.split(highlight) : [title]

  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        {titleParts[0]}
        {highlight && <span className="text-red-600">{highlight}</span>}
        {titleParts[1]}
      </h2>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">{description}</p>
    </div>
  )
}

