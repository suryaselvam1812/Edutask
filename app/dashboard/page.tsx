"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, CheckCircle, Clock, AlertCircle, TrendingUp, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NewTaskDialog } from "@/components/new-task-dialog"

interface User {
  email: string
  role: string
  name: string
}

interface Task {
  id: number
  title: string
  description: string
  faculty: string
  department: string
  dueDate: string
  status: string
  priority: string
  createdDate: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }

    // Initialize tasks
    const initialTasks = [
      {
        id: 1,
        title: "Submit Course Outcome Assessment",
        description: "Complete assessment for all courses taught in the current semester",
        faculty: "Dr. Sarah Johnson",
        department: "Computer Science",
        dueDate: "2024-01-15",
        status: "pending",
        priority: "high",
        createdDate: "2024-01-01",
      },
      {
        id: 2,
        title: "Update Curriculum Mapping",
        description: "Map curriculum to program outcomes and course objectives",
        faculty: "Prof. Michael Chen",
        department: "Electronics",
        dueDate: "2024-01-18",
        status: "in-progress",
        priority: "medium",
        createdDate: "2024-01-02",
      },
      {
        id: 3,
        title: "Prepare NAAC Documentation",
        description: "Compile all required documents for NAAC accreditation",
        faculty: "Dr. Emily Davis",
        department: "Mathematics",
        dueDate: "2024-01-20",
        status: "completed",
        priority: "high",
        createdDate: "2024-01-03",
      },
      {
        id: 4,
        title: "Faculty Development Program Report",
        description: "Submit report on attended faculty development programs",
        faculty: "Prof. Robert Wilson",
        department: "Physics",
        dueDate: "2024-01-22",
        status: "pending",
        priority: "low",
        createdDate: "2024-01-04",
      },
      {
        id: 5,
        title: "Research Publication Summary",
        description: "Provide summary of research publications for the academic year",
        faculty: "Dr. Lisa Anderson",
        department: "Chemistry",
        dueDate: "2024-01-25",
        status: "in-progress",
        priority: "medium",
        createdDate: "2024-01-05",
      },
    ]
    setTasks(initialTasks)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("iqac_user")
    router.push("/login")
  }

  const handleTaskCreate = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
  }

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

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const recentTasks = tasks.slice(0, 5)

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
              <NewTaskDialog onTaskCreate={handleTaskCreate} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">
            {user.role === "admin"
              ? "Here's an overview of all faculty tasks and system activity."
              : "Here's your task dashboard and recent assignments."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest task assignments and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-500">
                        Assigned to: <span className="font-medium">{task.faculty}</span>
                      </span>
                      <span className="text-sm text-gray-500">Department: {task.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                    <div className="text-sm text-gray-500 flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/tasks">
                <Button variant="outline">View All Tasks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
