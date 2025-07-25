"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { NewTaskDialog } from "@/components/new-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { getTasks, deleteTask, type Task, type User } from "@/lib/storage"

export default function TasksPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("edutask_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadTasks()
    setLoading(false)
  }, [router])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter, departmentFilter, user])

  const loadTasks = async () => {
    try {
      const tasksData = await getTasks()
      setTasks(tasksData || [])
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setTasks([])
    }
  }

  const filterTasks = () => {
    if (!user) return

    let filtered = user.role === "staff" ? tasks.filter((task) => task.assigned_to === user.id) : tasks

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assigned_user?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((task) => task.department === departmentFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleLogout = () => {
    localStorage.removeItem("edutask_user")
    router.push("/login")
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
    setShowNewTaskDialog(false)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setShowEditTaskDialog(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await deleteTask(taskToDelete.id)
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id))
      setShowDeleteDialog(false)
      setTaskToDelete(null)
    } catch (error) {
      console.error("Failed to delete task:", error)
      alert("Failed to delete task. Please try again.")
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Economics",
    "Management",
    "Engineering",
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

  const canCreateTasks = user.role === "iqac" || user.role === "hod"
  const canEditTasks = user.role === "iqac" || user.role === "hod"

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
            <Link href="/tasks" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.role === "staff" ? "My Tasks" : "All Tasks"}</h2>
              <p className="text-gray-600">
                {user.role === "staff" ? "Tasks assigned to you" : "Manage and monitor all faculty tasks"}
              </p>
            </div>
            {canCreateTasks && (
              <Button onClick={() => setShowNewTaskDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPriorityFilter("all")
                    setDepartmentFilter("all")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
              <CardDescription>
                {user.role === "staff" ? "Your assigned tasks" : "All tasks in the system"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || departmentFilter !== "all"
                      ? "Try adjusting your filters to see more tasks."
                      : user.role === "staff"
                        ? "No tasks have been assigned to you yet."
                        : "Get started by creating your first task."}
                  </p>
                  {canCreateTasks &&
                    !searchTerm &&
                    statusFilter === "all" &&
                    priorityFilter === "all" &&
                    departmentFilter === "all" && (
                      <Button onClick={() => setShowNewTaskDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Task
                      </Button>
                    )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {task.assigned_user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                          <p className="text-sm text-gray-500 truncate">{task.description || "No description"}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Assigned to: {task.assigned_user?.name || "Unassigned"}
                            </span>
                            {task.department && (
                              <span className="text-xs text-gray-500">Department: {task.department}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
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
                        </div>
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
                        {canEditTasks && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task)
                                  setShowEditTaskDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTaskToDelete(task)
                                  setShowDeleteDialog(true)
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Dialogs */}
      {showNewTaskDialog && (
        <NewTaskDialog
          open={showNewTaskDialog}
          onOpenChange={setShowNewTaskDialog}
          onTaskCreated={handleTaskCreated}
          currentUser={user}
        />
      )}

      {showEditTaskDialog && selectedTask && (
        <EditTaskDialog
          open={showEditTaskDialog}
          onOpenChange={setShowEditTaskDialog}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
