import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Bell, Calendar, Clock, Search, Star } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // This would normally be fetched from an API
  const upcomingAwards = [
    {
      id: 1,
      name: "Business Innovation Award",
      deadline: "May 15, 2025",
      category: "Business",
      daysLeft: 14,
    },
    {
      id: 2,
      name: "Tech Startup of the Year",
      deadline: "June 3, 2025",
      category: "Technology",
      daysLeft: 33,
    },
    {
      id: 3,
      name: "Sustainability Excellence Award",
      deadline: "June 20, 2025",
      category: "Environment",
      daysLeft: 50,
    },
  ]

  const savedAwards = [
    {
      id: 4,
      name: "Global Leadership Award",
      deadline: "July 10, 2025",
      category: "Leadership",
      daysLeft: 70,
    },
    {
      id: 5,
      name: "Customer Service Excellence",
      deadline: "August 5, 2025",
      category: "Service",
      daysLeft: 96,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10">
        Your <span className="text-red-600">Dashboard</span>
      </h1>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-gray-200 p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="awards"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Awards
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="text-base font-bold py-2 px-4 data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card className="border-2 border-gray-300 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50">
                <CardTitle className="text-base font-bold text-black">Upcoming Deadlines</CardTitle>
                <div className="bg-red-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-extrabold text-black">{upcomingAwards.length}</div>
                <p className="text-sm text-gray-600 font-medium">
                  Next deadline in <span className="font-bold">{upcomingAwards[0]?.daysLeft} days</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50">
                <CardTitle className="text-base font-bold text-black">Saved Awards</CardTitle>
                <div className="bg-red-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-extrabold text-black">{savedAwards.length}</div>
                <p className="text-sm text-gray-600 font-medium">
                  Across{" "}
                  <span className="font-bold">
                    {new Set([...savedAwards, ...upcomingAwards].map((a) => a.category)).size} categories
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gray-50">
                <CardTitle className="text-base font-bold text-black">Subscription Status</CardTitle>
                <div className="bg-red-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-extrabold text-black">Premium</div>
                <p className="text-sm text-gray-600 font-medium">
                  Renews on <span className="font-bold">May 1, 2025</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Awards */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Award Deadlines</CardTitle>
              <CardDescription>Stay on top of your award submission schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAwards.map((award) => (
                  <div
                    key={award.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{award.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Deadline: {award.deadline}</span>
                        <span className="mx-2">•</span>
                        <span>{award.category}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        award.daysLeft < 15
                          ? "bg-red-100 text-red-800"
                          : award.daysLeft < 30
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {award.daysLeft} days left
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Latest from Your Newsletter</CardTitle>
              <CardDescription>Exclusive award opportunities for Premium members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">New Opportunity Alert: Global Innovation Awards</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    The Global Innovation Awards are now accepting submissions for their 2025 program. This prestigious
                    award recognizes breakthrough innovations across multiple industries.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Deadline: August 15, 2025</div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/newsletter" className="text-sm text-red-600 hover:underline">
                    View all newsletter content →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Award Search</h2>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Find New Awards
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Saved Awards</CardTitle>
              <CardDescription>Awards you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...upcomingAwards, ...savedAwards].map((award) => (
                  <div
                    key={award.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{award.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Deadline: {award.deadline}</span>
                        <span className="mx-2">•</span>
                        <span>{award.category}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-black text-black hover:bg-gray-100">
                        Details
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Award Calendar</CardTitle>
              <CardDescription>View and manage your award deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <Calendar className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                <p className="text-gray-600 mb-4">Your award deadlines would be displayed here in a calendar format.</p>
                <Button className="bg-black hover:bg-gray-800 text-white">Set Reminder</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Awards with approaching deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAwards.map((award) => (
                  <div
                    key={award.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{award.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Deadline: {award.deadline}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-black text-black hover:bg-gray-100">
                      <Bell className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Management</CardTitle>
              <CardDescription>Upgrade to Custom tier to access submission management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <Award className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Custom Tier Feature</h3>
                <p className="text-gray-600 mb-4">
                  Submission management tools are available exclusively for Custom tier subscribers. Upgrade your plan
                  to access these features.
                </p>
                <Button className="bg-black hover:bg-gray-800 text-white">Upgrade to Custom</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

