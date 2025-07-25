"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Search, TrendingUp, LogOut, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NewTaskDialog } from "@/components/new-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"

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

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
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

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

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
              <Link href="/tasks" className="text-blue-600 font-medium">
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Faculty Tasks</h2>
          <p className="text-gray-600">Manage and track all faculty task assignments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tasks, faculty, or departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                    <CardDescription className="text-base mb-4">{task.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned to:</p>
                    <p className="font-semibold">{task.faculty}</p>
                    <p className="text-sm text-gray-500">{task.department} Department</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-500">Created: {new Date(task.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <EditTaskDialog task={task} onTaskUpdate={handleTaskUpdate} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No tasks found matching your criteria.</p>
              <div className="mt-4">
                <NewTaskDialog onTaskCreate={handleTaskCreate} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
