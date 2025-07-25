"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, Clock, Users, FileText, TrendingUp, LogOut } from "lucide-react"
import Link from "next/link"

interface User {
  email: string
  role: string
  name: string
}

export default function Dashboard() {
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

  const stats = [
    { title: "Total Tasks", value: "24", icon: FileText, color: "text-blue-600" },
    { title: "Completed", value: "18", icon: CheckCircle, color: "text-green-600" },
    { title: "In Progress", value: "4", icon: Clock, color: "text-yellow-600" },
    { title: "Faculty Members", value: "12", icon: Users, color: "text-purple-600" },
  ]

  const recentTasks = [
    {
      id: 1,
      title: "Submit Course Outcome Assessment",
      faculty: "Dr. Sarah Johnson",
      dueDate: "2024-01-15",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Update Curriculum Mapping",
      faculty: "Prof. Michael Chen",
      dueDate: "2024-01-18",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: 3,
      title: "Prepare NAAC Documentation",
      faculty: "Dr. Emily Davis",
      dueDate: "2024-01-20",
      status: "completed",
      priority: "high",
    },
    {
      id: 4,
      title: "Faculty Development Program Report",
      faculty: "Prof. Robert Wilson",
      dueDate: "2024-01-22",
      status: "pending",
      priority: "low",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
              <Link href="/dashboard" className="text-blue-600 font-medium">
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
              <Link href="/reports" className="text-gray-500 hover:text-gray-700">
                Reports
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h2>
          <p className="text-gray-600">Here's what's happening with your faculty tasks today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Tasks
              <Button variant="outline" size="sm">
                <Link href="/tasks">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>Latest faculty task assignments and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Assigned to: {task.faculty}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
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
