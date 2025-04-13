"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  FileText, 
  Trophy, 
  Newspaper, 
  BarChart, 
  Calendar, 
  Users, 
  Shield 
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Powerful Features for Award Success
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Everything you need to discover, apply for, and win industry awards that matter to your business.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Award Discovery */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Search className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Smart Award Discovery</h3>
              <p className="mt-2 text-base text-gray-500">
                Our AI-powered system matches your business profile with relevant industry awards. Get personalized recommendations based on your industry, size, and achievements.
              </p>
            </div>
          </div>

          {/* Application Support */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">AI-Powered Application Support</h3>
              <p className="mt-2 text-base text-gray-500">
                Get intelligent assistance in crafting winning applications. Our AI helps you highlight your strengths and present your business in the best possible light.
              </p>
            </div>
          </div>

          {/* PR Opportunities */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Newspaper className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Guaranteed PR Opportunities</h3>
              <p className="mt-2 text-base text-gray-500">
                Leverage your award wins for maximum exposure. We connect you with media partners and help you create compelling press releases.
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Performance Analytics</h3>
              <p className="mt-2 text-base text-gray-500">
                Track your award journey and measure the impact of your wins. Get insights into how awards affect your business growth and reputation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Additional Benefits
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-indigo-600" />
                <CardTitle>Deadline Management</CardTitle>
                <CardDescription>
                  Never miss an important deadline with our smart calendar and reminder system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="h-12 w-12 text-indigo-600" />
                <CardTitle>Winning Strategies</CardTitle>
                <CardDescription>
                  Access proven strategies and templates from past award winners.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600" />
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Get guidance from our team of award specialists and industry experts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-indigo-600" />
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>
                  Your business information is protected with enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your award journey?</span>
            <span className="block text-indigo-200">Join thousands of successful businesses today.</span>
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