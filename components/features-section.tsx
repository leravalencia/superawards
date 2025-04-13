"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Award Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to discover, apply for, and win industry awards that matter to your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Search className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Smart Award Discovery</CardTitle>
              <CardDescription>
                AI-powered matching with relevant industry awards based on your business profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Personalized recommendations</li>
                <li>• Industry-specific matches</li>
                <li>• Real-time updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>AI Application Support</CardTitle>
              <CardDescription>
                Intelligent assistance in crafting winning award applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Smart content suggestions</li>
                <li>• Application templates</li>
                <li>• Proofreading assistance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Newspaper className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>PR Opportunities</CardTitle>
              <CardDescription>
                Guaranteed media exposure and press coverage for your wins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Media partnerships</li>
                <li>• Press release creation</li>
                <li>• Social media promotion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Track and measure the impact of your award journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Award success metrics</li>
                <li>• ROI tracking</li>
                <li>• Business impact analysis</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Deadline Management</CardTitle>
              <CardDescription>
                Never miss an important award deadline
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Trophy className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Winning Strategies</CardTitle>
              <CardDescription>
                Access proven strategies from past winners
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Expert Support</CardTitle>
              <CardDescription>
                Guidance from award specialists
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>
                Enterprise-grade security for your data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}

