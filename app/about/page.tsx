"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              About Award AI
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Our AI-powered platform simplifies the award discovery and application process, helping small business owners get recognized in their industry and gain guaranteed PR.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            To empower small businesses with AI-driven award discovery and application tools that help them gain recognition, credibility, and valuable PR opportunities in their industry.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-indigo-600" />
                <CardTitle>Award Discovery</CardTitle>
                <CardDescription>
                  Find relevant industry awards that match your business profile and goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600" />
                <CardTitle>Application Support</CardTitle>
                <CardDescription>
                  Get AI-powered assistance in crafting winning award applications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-indigo-600" />
                <CardTitle>PR Opportunities</CardTitle>
                <CardDescription>
                  Leverage your awards for guaranteed PR and media exposure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-indigo-600" />
                <CardTitle>Industry Recognition</CardTitle>
                <CardDescription>
                  Build credibility and stand out in your industry through award wins.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            We're a passionate group of AI experts and business professionals dedicated to helping small businesses succeed through award recognition.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardHeader>
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-500">{member.initials}</span>
                </div>
                <CardTitle className="text-center mt-4">{member.name}</CardTitle>
                <CardDescription className="text-center">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to discover your next award opportunity?</span>
            <span className="block text-indigo-200">Start your journey to recognition today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => window.location.href = '/auth/signup'}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const teamMembers = [
  {
    name: "John Doe",
    initials: "JD",
    role: "Founder & CEO",
    bio: "Passionate about helping small businesses gain recognition through strategic award applications."
  },
  {
    name: "Jane Smith",
    initials: "JS",
    role: "Head of AI",
    bio: "Dedicated to developing intelligent solutions that simplify the award discovery process."
  },
  {
    name: "Mike Johnson",
    initials: "MJ",
    role: "Business Development",
    bio: "Focused on creating valuable partnerships and PR opportunities for our clients."
  }
] 