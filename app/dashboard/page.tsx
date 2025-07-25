"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  Calendar,
  Shield,
  GraduationCap,
  LogOut,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { NewTaskDialog } from "@/components/new-task-dialog"
import { getTasks, type Task, type User } from "@/lib/storage"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadTasks()
    setLoading(false)
  }, [router])

  const loadTasks = async () => {
    try {
      const tasksData = await getTasks()
      setTasks(tasksData || [])
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setTasks([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("iqac_user")
    router.push("/login")
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
    setShowNewTaskDialog(false)
  }

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

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case "iqac":
        return "Welcome to IQAC SmartTrack - Quality Assurance Dashboard"
      case "hod":
        return "Welcome to IQAC SmartTrack - Department Management Dashboard"
      case "staff":
        return "Welcome to IQAC SmartTrack - Your Task Dashboard"
      default:
        return "Welcome to IQAC SmartTrack"
    }
  }

  // Filter tasks based on user role
  const filteredTasks = user.role === "staff" ? tasks.filter((task) => task.assigned_to === user.id) : tasks

  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((task) => task.status === "completed").length
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in_progress").length
  const pendingTasks = filteredTasks.filter((task) => task.status === "pending").length

  const recentTasks = filteredTasks.slice(0, 5)

  const canCreateTasks = user.role === "iqac" || user.role === "hod"

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
            <Link href="/dashboard" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
            <Link
              href="/reports"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getWelcomeMessage(user.role)}</h2>
            <p className="text-gray-600">
              {user.role === "staff"
                ? "Track your assigned tasks and manage your submissions."
                : "Manage faculty tasks and monitor quality assurance activities."}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {user.role === "staff" ? "Assigned to you" : "All tasks in system"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {totalTasks > 0
                    ? `${Math.round((completedTasks / totalTasks) * 100)}% completion rate`
                    : "No tasks yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                <p className="text-xs text-muted-foreground">Currently being worked on</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>
                  {user.role === "staff" ? "Your latest assigned tasks" : "Latest tasks in the system"}
                </CardDescription>
              </div>
              {canCreateTasks && (
                <Button onClick={() => setShowNewTaskDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">
                    {user.role === "staff"
                      ? "No tasks have been assigned to you yet."
                      : "Get started by creating your first task."}
                  </p>
                  {canCreateTasks && (
                    <Button onClick={() => setShowNewTaskDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {task.assigned_user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-500">
                            Assigned to: {task.assigned_user?.name || "Unassigned"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : task.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
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
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "high"
                              ? "border-red-200 text-red-800"
                              : task.priority === "medium"
                                ? "border-yellow-200 text-yellow-800"
                                : "border-green-200 text-green-800"
                          }
                        >
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* New Task Dialog */}
      {showNewTaskDialog && (
        <NewTaskDialog
          open={showNewTaskDialog}
          onOpenChange={setShowNewTaskDialog}
          onTaskCreated={handleTaskCreated}
          currentUser={user}
        />
      )}
    </div>
  )
}
