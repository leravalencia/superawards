import {
  Award,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200" variant="sidebar">
          <SidebarHeader className="border-b border-gray-200">
            <div className="flex items-center gap-2 px-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Award-AI</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/dashboard">
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/my-awards">
                    <Award className="h-5 w-5" />
                    <span>My Awards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/applications">
                    <FileText className="h-5 w-5" />
                    <span>Applications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/deadlines">
                    <Calendar className="h-5 w-5" />
                    <span>Deadlines</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-gray-500">Premium Plan</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, John! Here's your award activity.</p>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Find New Awards</Button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>12% increase this month</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Awards Won</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>2 new this quarter</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">29%</div>
                  <div className="mt-2">
                    <Progress value={29} className="h-2 [&>div]:bg-indigo-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Estimated Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$45,000</div>
                  <p className="text-xs text-gray-500 mt-1">From monetary awards & grants</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Applications */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <div>
                    <CardTitle>Active Applications</CardTitle>
                    <CardDescription>Your current award submissions</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/applications"
                    className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    {activeApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(app.status).bgLight}`}>
                            {getStatusIcon(app.status, getStatusColor(app.status).text)}
                          </div>
                          <div>
                            <h3 className="font-medium">{app.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Due: {app.deadline}</span>
                              <span className="mx-2">•</span>
                              <span>{app.category}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(app.status).border} ${getStatusColor(app.status).text}`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <div>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Next 4 deadlines</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/deadlines"
                    className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
                  >
                    Calendar <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-start gap-4">
                        <div className="bg-indigo-100 rounded-lg p-2 text-center min-w-[3rem]">
                          <span className="block text-xs font-medium text-indigo-700">{deadline.month}</span>
                          <span className="block text-lg font-bold text-indigo-700">{deadline.day}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{deadline.name}</h3>
                          <p className="text-sm text-gray-500">{deadline.daysLeft} days left</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Awards */}
            <div className="mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <div>
                    <CardTitle>Recommended Awards</CardTitle>
                    <CardDescription>Personalized for your profile</CardDescription>
                  </div>
                  <Link
                    href="/search"
                    className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
                  >
                    Find More <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedAwards.map((award) => (
                      <div
                        key={award.id}
                        className="border rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">{award.name}</h3>
                          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                            {award.match}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{award.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Deadline: {award.deadline}</span>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Apply Now</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance & ROI */}
            <div className="mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <div>
                    <CardTitle>Performance & ROI</CardTitle>
                    <CardDescription>Your award application results</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="categories">By Category</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Total Applied</div>
                          <div className="text-3xl font-bold">24</div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm">
                              <div className="font-medium">Pending</div>
                              <div className="text-gray-500">12 applications</div>
                            </div>
                            <div className="text-sm text-right">
                              <div className="font-medium">Completed</div>
                              <div className="text-gray-500">12 applications</div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Success Rate</div>
                          <div className="text-3xl font-bold">29%</div>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Won</span>
                              <span>7 awards</span>
                            </div>
                            <Progress value={29} className="h-2 [&>div]:bg-indigo-600" />
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Total Value</div>
                          <div className="text-3xl font-bold">$45,000</div>
                          <div className="mt-4 text-sm">
                            <div className="flex justify-between mb-1">
                              <span>Monetary</span>
                              <span>$35,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Recognition</span>
                              <span>$10,000 (est.)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="categories">
                      <div className="text-center py-8 text-gray-500">
                        Category breakdown will be available after more applications
                      </div>
                    </TabsContent>
                    <TabsContent value="timeline">
                      <div className="text-center py-8 text-gray-500">
                        Timeline view will be available after more applications
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

// Helper functions and data
function getStatusColor(status: string) {
  switch (status) {
    case "Submitted":
      return {
        bgLight: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      }
    case "In Review":
      return {
        bgLight: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      }
    case "Draft":
      return {
        bgLight: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    case "Shortlisted":
      return {
        bgLight: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      }
    default:
      return {
        bgLight: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
  }
}

function getStatusIcon(status: string, colorClass: string) {
  switch (status) {
    case "Submitted":
      return <FileText className={`h-5 w-5 ${colorClass}`} />
    case "In Review":
      return <Clock className={`h-5 w-5 ${colorClass}`} />
    case "Draft":
      return <FileText className={`h-5 w-5 ${colorClass}`} />
    case "Shortlisted":
      return <CheckCircle className={`h-5 w-5 ${colorClass}`} />
    default:
      return <AlertCircle className={`h-5 w-5 ${colorClass}`} />
  }
}

// Sample data
const activeApplications = [
  {
    id: 1,
    name: "Business Innovation Award",
    deadline: "May 15, 2025",
    category: "Business",
    status: "Submitted",
  },
  {
    id: 2,
    name: "Tech Startup of the Year",
    deadline: "June 3, 2025",
    category: "Technology",
    status: "In Review",
  },
  {
    id: 3,
    name: "Sustainability Excellence Award",
    deadline: "June 20, 2025",
    category: "Environment",
    status: "Draft",
  },
  {
    id: 4,
    name: "Global Leadership Award",
    deadline: "July 10, 2025",
    category: "Leadership",
    status: "Shortlisted",
  },
]

const upcomingDeadlines = [
  {
    id: 1,
    name: "Business Innovation Award",
    month: "May",
    day: "15",
    daysLeft: 14,
  },
  {
    id: 2,
    name: "Tech Startup of the Year",
    month: "Jun",
    day: "3",
    daysLeft: 33,
  },
  {
    id: 3,
    name: "Sustainability Excellence Award",
    month: "Jun",
    day: "20",
    daysLeft: 50,
  },
  {
    id: 4,
    name: "Global Leadership Award",
    month: "Jul",
    day: "10",
    daysLeft: 70,
  },
]

const recommendedAwards = [
  {
    id: 1,
    name: "Digital Transformation Award",
    description: "Recognizing companies that have successfully implemented digital transformation strategies.",
    deadline: "August 15, 2025",
    match: 95,
  },
  {
    id: 2,
    name: "Emerging Entrepreneur Award",
    description: "Celebrating innovative entrepreneurs who are making a significant impact in their industry.",
    deadline: "September 5, 2025",
    match: 87,
  },
  {
    id: 3,
    name: "Product Innovation Excellence",
    description: "Honoring organizations that have developed groundbreaking products or services.",
    deadline: "October 12, 2025",
    match: 82,
  },
]

