"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, FileText, PieChart, TrendingUp, Calendar, LogOut } from "lucide-react"
import Link from "next/link"

interface User {
  email: string
  role: string
  name: string
}

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("iqac_user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const reportData = {
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 4,
    inProgressTasks: 2,
    completionRate: 75,
    averageCompletionTime: 5.2,
  }

  const departmentStats = [
    { department: "Computer Science", total: 8, completed: 6, pending: 2 },
    { department: "Electronics", total: 6, completed: 5, pending: 1 },
    { department: "Mathematics", total: 4, completed: 3, pending: 1 },
    { department: "Physics", total: 3, completed: 2, pending: 1 },
    { department: "Chemistry", total: 3, completed: 2, pending: 1 },
  ]

  const monthlyProgress = [
    { month: "Oct 2023", completed: 12, assigned: 15 },
    { month: "Nov 2023", completed: 14, assigned: 16 },
    { month: "Dec 2023", completed: 16, assigned: 18 },
    { month: "Jan 2024", completed: 18, assigned: 24 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">IQAC SmartTrack</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gray-500 hover:text-gray-700">
                Tasks
              </Link>
              <Link href="/faculty" className="text-gray-500 hover:text-gray-700">
                Faculty
              </Link>
              <Link href="/upload" className="text-gray-500 hover:text-gray-700">
                Upload
              </Link>
              <Link href="/reports" className="text-blue-600 font-medium">
                Reports
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into faculty task performance and completion rates</p>
        </div>

        {/* Report Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select defaultValue="current-month">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-departments">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All Departments</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{reportData.totalTasks}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.completionRate}%</p>
                </div>
                <PieChart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                  <p className="text-3xl font-bold text-purple-600">{reportData.averageCompletionTime}d</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-3xl font-bold text-red-600">{reportData.pendingTasks}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Task completion statistics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">Total: {dept.total}</span>
                      <span className="text-sm text-green-600">Completed: {dept.completed}</span>
                      <span className="text-sm text-red-600">Pending: {dept.pending}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{Math.round((dept.completed / dept.total) * 100)}% Complete</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress Trend</CardTitle>
            <CardDescription>Task assignment and completion trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyProgress.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{month.month}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-blue-600">Assigned: {month.assigned}</span>
                      <span className="text-sm text-green-600">Completed: {month.completed}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      {Math.round((month.completed / month.assigned) * 100)}% Rate
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
