"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  TrendingUp,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { getTasks, getUsers, getFiles, type Task, type User, type UploadedFile } from "@/lib/storage"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("edutask_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadData()
    setLoading(false)
  }, [router])

  const loadData = async () => {
    try {
      const [tasksData, usersData, filesData] = await Promise.all([getTasks(), getUsers(), getFiles()])
      setTasks(tasksData || [])
      setUsers(usersData || [])
      setFiles(filesData || [])
    } catch (error) {
      console.error("Failed to load data:", error)
      setTasks([])
      setUsers([])
      setFiles([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("edutask_user")
    router.push("/login")
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "iqac":
        return <Shield className="h-5 w-5 text-blue-600" />
      case "hod":
        return <Users className="h-5 w-5 text-green-600" />
      case "staff":
        return <GraduationCap className="h-5 w-5 text-purple-600" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "iqac":
        return "bg-blue-100 text-blue-800"
      case "hod":
        return "bg-green-100 text-green-800"
      case "staff":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter tasks based on time period
  const getFilteredTasks = () => {
    if (timeFilter === "all") return tasks

    const now = new Date()
    const filterDate = new Date()

    switch (timeFilter) {
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3)
        break
      default:
        return tasks
    }

    return tasks.filter((task) => new Date(task.created_at) >= filterDate)
  }

  const filteredTasks = getFilteredTasks()

  // Calculate statistics
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((task) => task.status === "completed").length
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in_progress").length
  const pendingTasks = filteredTasks.filter((task) => task.status === "pending").length
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.role === "staff").length
  const totalFiles = files.length

  // Status distribution data
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#10B981" },
    { name: "In Progress", value: inProgressTasks, color: "#3B82F6" },
    { name: "Pending", value: pendingTasks, color: "#F59E0B" },
  ]

  // Priority distribution data
  const priorityData = [
    { name: "High", value: filteredTasks.filter((t) => t.priority === "high").length, color: "#EF4444" },
    { name: "Medium", value: filteredTasks.filter((t) => t.priority === "medium").length, color: "#F59E0B" },
    { name: "Low", value: filteredTasks.filter((t) => t.priority === "low").length, color: "#10B981" },
  ]

  // Department performance data
  const departments = Array.from(new Set(filteredTasks.map((task) => task.department).filter(Boolean)))
  const departmentData = departments.map((dept) => {
    const deptTasks = filteredTasks.filter((task) => task.department === dept)
    const completed = deptTasks.filter((task) => task.status === "completed").length
    return {
      name: dept,
      total: deptTasks.length,
      completed,
      completionRate: deptTasks.length > 0 ? Math.round((completed / deptTasks.length) * 100) : 0,
    }
  })

  // Monthly task creation trend (mock data for demonstration)
  const monthlyData = [
    { month: "Jan", tasks: 12, completed: 8 },
    { month: "Feb", tasks: 15, completed: 12 },
    { month: "Mar", tasks: 18, completed: 14 },
    { month: "Apr", tasks: 22, completed: 18 },
    { month: "May", tasks: 25, completed: 20 },
    { month: "Jun", tasks: 20, completed: 16 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">EduTask</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon(user.role)}
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              {user.role === "staff" ? "My Tasks" : "All Tasks"}
            </Link>
            <Link
              href="/faculty"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Faculty
            </Link>
            <Link
              href="/upload"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Upload Files
            </Link>
            <Link href="/reports" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <p className="text-gray-600">Comprehensive insights into task management and faculty performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {timeFilter === "all" ? "All time" : `Last ${timeFilter}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">Staff members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of {totalTasks} tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFiles}</div>
                <p className="text-xs text-muted-foreground">Total documents</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Current status of all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Task completion rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completionRate" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Task Trend</CardTitle>
                <CardDescription>Task creation and completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#8884d8" name="Created" />
                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Faculty with highest task completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((u) => u.role === "staff")
                    .map((faculty) => {
                      const facultyTasks = filteredTasks.filter((task) => task.assigned_to === faculty.id)
                      const completed = facultyTasks.filter((task) => task.status === "completed").length
                      const completionRate = facultyTasks.length > 0 ? (completed / facultyTasks.length) * 100 : 0
                      return { ...faculty, completionRate, totalTasks: facultyTasks.length }
                    })
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .slice(0, 5)
                    .map((faculty) => (
                      <div key={faculty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{faculty.name}</p>
                          <p className="text-sm text-gray-500">{faculty.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{Math.round(faculty.completionRate)}%</p>
                          <p className="text-xs text-gray-500">{faculty.totalTasks} tasks</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest task updates and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .slice(0, 5)
                    .map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {task.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : task.status === "in_progress" ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            {task.assigned_user?.name} • {new Date(task.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                          }
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
