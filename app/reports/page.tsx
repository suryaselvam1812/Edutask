"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, LogOut, Shield, Users, GraduationCap, FileText, Download, BarChart3, PieChart } from "lucide-react"
import Link from "next/link"
import { getTasks, getUsers, getUploadedFiles, type User, type Task, type UploadedFile } from "@/lib/storage"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
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
      const [tasksData, usersData, filesData] = await Promise.all([getTasks(), getUsers(), getUploadedFiles()])
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
    localStorage.removeItem("iqac_user")
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

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const totalFiles = files.length
  const totalUsers = users.length
  const staffUsers = users.filter((u) => u.role === "staff").length

  // Department statistics
  const departments = Array.from(new Set(tasks.map((task) => task.department).filter(Boolean)))
  const departmentStats = departments.map((dept) => {
    const deptTasks = tasks.filter((task) => task.department === dept)
    const deptCompleted = deptTasks.filter((task) => task.status === "completed").length
    return {
      name: dept,
      total: deptTasks.length,
      completed: deptCompleted,
      rate: deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0,
    }
  })

  // Priority distribution
  const highPriority = tasks.filter((task) => task.priority === "high").length
  const mediumPriority = tasks.filter((task) => task.priority === "medium").length
  const lowPriority = tasks.filter((task) => task.priority === "low").length

  // Recent activity
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const recentFiles = files
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

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
                <h1 className="text-xl font-bold text-gray-900">IQAC SmartTrack</h1>
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
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
              <p className="text-gray-600">Comprehensive overview of IQAC activities and performance metrics.</p>
            </div>
            <div className="flex space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
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
                <p className="text-xs text-muted-foreground">Across all departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of {totalTasks} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staffUsers}</div>
                <p className="text-xs text-muted-foreground">Staff members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFiles}</div>
                <p className="text-xs text-muted-foreground">Documents & files</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Task Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Task Status Distribution
                </CardTitle>
                <CardDescription>Current status of all tasks in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{completedTasks}</div>
                      <div className="text-xs text-gray-500">{completionRate}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{inProgressTasks}</div>
                      <div className="text-xs text-gray-500">
                        {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{pendingTasks}</div>
                      <div className="text-xs text-gray-500">
                        {totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Priority Distribution
                </CardTitle>
                <CardDescription>Task distribution by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">High Priority</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{highPriority}</div>
                      <div className="text-xs text-gray-500">
                        {totalTasks > 0 ? Math.round((highPriority / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Medium Priority</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{mediumPriority}</div>
                      <div className="text-xs text-gray-500">
                        {totalTasks > 0 ? Math.round((mediumPriority / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Low Priority</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{lowPriority}</div>
                      <div className="text-xs text-gray-500">
                        {totalTasks > 0 ? Math.round((lowPriority / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Task completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              {departmentStats.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No department data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-500">{dept.total} total tasks</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{dept.rate}%</div>
                        <div className="text-sm text-gray-500">{dept.completed} completed</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest task activities</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent tasks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                          <p className="text-sm text-gray-500">
                            {task.assigned_user?.name || "Unassigned"} • {task.department}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
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
                          <div className="text-xs text-gray-500">{new Date(task.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Files */}
            <Card>
              <CardHeader>
                <CardTitle>Recent File Uploads</CardTitle>
                <CardDescription>Latest document submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent uploads</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{file.upload_title || file.file_name}</h4>
                          <p className="text-sm text-gray-500">
                            {file.uploaded_user?.name || "Unknown"} • {file.category || "Uncategorized"}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(file.created_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
