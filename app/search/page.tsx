"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Filter, Search, Star } from "lucide-react"

export default function SearchPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock data for awards
  const awards = [
    {
      id: 1,
      name: "Business Innovation Award",
      organization: "Global Business Alliance",
      deadline: "May 15, 2025",
      category: "Business",
      description: "Recognizing innovative business practices that drive growth and sustainability.",
      eligibility: "Small to medium-sized businesses with innovative solutions.",
      prize: "$10,000 and global recognition",
    },
    {
      id: 2,
      name: "Tech Startup of the Year",
      organization: "Tech Innovators Association",
      deadline: "June 3, 2025",
      category: "Technology",
      description: "Celebrating startups that are revolutionizing the technology landscape.",
      eligibility: "Tech startups founded within the last 5 years.",
      prize: "$25,000 and mentorship opportunities",
    },
    {
      id: 3,
      name: "Sustainability Excellence Award",
      organization: "Green Future Foundation",
      deadline: "June 20, 2025",
      category: "Environment",
      description: "Honoring organizations committed to sustainable practices and environmental stewardship.",
      eligibility: "Organizations with demonstrated commitment to sustainability.",
      prize: "$15,000 and media coverage",
    },
    {
      id: 4,
      name: "Global Leadership Award",
      organization: "International Leadership Council",
      deadline: "July 10, 2025",
      category: "Leadership",
      description: "Recognizing exceptional leadership that drives positive change.",
      eligibility: "Leaders with a track record of impactful initiatives.",
      prize: "Global recognition and speaking opportunities",
    },
    {
      id: 5,
      name: "Customer Service Excellence",
      organization: "Customer Experience Institute",
      deadline: "August 5, 2025",
      category: "Service",
      description: "Celebrating organizations that provide outstanding customer service.",
      eligibility: "Organizations with exceptional customer satisfaction metrics.",
      prize: "$5,000 and industry recognition",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10">
        Find <span className="text-red-600">Awards</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Section */}
        <div className={`md:w-1/4 space-y-6 ${isFilterOpen ? "block" : "hidden md:block"}`}>
          <Card>
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="deadline">
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="30days">Next 30 Days</SelectItem>
                    <SelectItem value="60days">Next 60 Days</SelectItem>
                    <SelectItem value="90days">Next 90 Days</SelectItem>
                    <SelectItem value="6months">Next 6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Award Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="monetary" />
                    <label htmlFor="monetary" className="text-sm">
                      Monetary Prize
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recognition" />
                    <label htmlFor="recognition" className="text-sm">
                      Recognition
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mentorship" />
                    <label htmlFor="mentorship" className="text-sm">
                      Mentorship
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="media" />
                    <label htmlFor="media" className="text-sm">
                      Media Coverage
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eligibility</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="startups" />
                    <label htmlFor="startups" className="text-sm">
                      Startups
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="small-business" />
                    <label htmlFor="small-business" className="text-sm">
                      Small Business
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enterprise" />
                    <label htmlFor="enterprise" className="text-sm">
                      Enterprise
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="non-profit" />
                    <label htmlFor="non-profit" className="text-sm">
                      Non-Profit
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="md:w-3/4">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 h-5 w-5" />
                <Input
                  placeholder="Search for awards..."
                  className="pl-12 py-6 text-lg border-2 border-gray-300 focus:border-red-500 rounded-lg"
                />
              </div>
              <Button className="sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 h-auto">
                Search
              </Button>
              <Button
                variant="outline"
                className="md:hidden flex items-center border-2 border-gray-300 text-black font-bold py-6 h-auto"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {awards.map((award) => (
              <Card key={award.id} className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-black">{award.name}</CardTitle>
                      <CardDescription className="text-base text-gray-700">{award.organization}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="bg-white rounded-full shadow-md hover:bg-red-50">
                      <Star className="h-6 w-6 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <p className="text-base">{award.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-base">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-bold text-black mb-1">Category</div>
                        <div className="text-gray-700">{award.category}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-bold text-black mb-1">Deadline</div>
                        <div className="text-gray-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-red-600" />
                          {award.deadline}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-bold text-black mb-1">Prize</div>
                        <div className="text-gray-700">{award.prize}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-base">
                      <div className="font-bold text-black mb-1">Eligibility</div>
                      <div className="text-gray-700">{award.eligibility}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    className="border-2 border-black text-black font-bold py-5 px-6 h-auto hover:bg-gray-100"
                  >
                    View Details
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 h-auto">
                    Save Award
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

