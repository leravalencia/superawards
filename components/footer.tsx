import Link from "next/link"
import { Award } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Award Guides", href: "/guides" },
        { name: "Webinars", href: "/webinars" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
    },
  ]

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-red-600 p-3 rounded-lg mr-3">
                <Award className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-black text-white">Award-AI.com</span>
            </div>
            <p className="text-gray-300 text-lg font-medium">AI-powered award discovery and submission platform.</p>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-6 text-red-500">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-red-500 text-lg font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-300 text-lg font-medium">© {currentYear} Award-AI.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

