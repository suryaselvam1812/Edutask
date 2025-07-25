"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Mail, Building, TrendingUp, LogOut, Shield, GraduationCap } from "lucide-react"
import Link from "next/link"
import { getUsers, getTasks, type User, type Task } from "@/lib/storage"

export default function FacultyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [faculty, setFaculty] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredFaculty, setFilteredFaculty] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

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

  useEffect(() => {
    filterFaculty()
  }, [faculty, searchTerm, departmentFilter, roleFilter])

  const loadData = async () => {
    try {
      const [facultyData, tasksData] = await Promise.all([getUsers(), getTasks()])
      setFaculty(facultyData || [])
      setTasks(tasksData || [])
    } catch (error) {
      console.error("Failed to load data:", error)
      setFaculty([])
      setTasks([])
    }
  }

  const filterFaculty = () => {
    let filtered = faculty

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((member) => member.department === departmentFilter)
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((member) => member.role === roleFilter)
    }

    setFilteredFaculty(filtered)
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

  const getFacultyStats = (facultyId: string) => {
    const facultyTasks = tasks.filter((task) => task.assigned_to === facultyId)
    const completed = facultyTasks.filter((task) => task.status === "completed").length
    const inProgress = facultyTasks.filter((task) => task.status === "in_progress").length
    const pending = facultyTasks.filter((task) => task.status === "pending").length

    return { total: facultyTasks.length, completed, inProgress, pending }
  }

  const departments = Array.from(new Set(faculty.map((member) => member.department))).sort()

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
            <Link href="/faculty" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Faculty Directory</h2>
            <p className="text-gray-600">View and manage faculty members and their task performance</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

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

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="iqac">IQAC</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                    setRoleFilter("all")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
                <p className="text-gray-500">
                  {searchTerm || departmentFilter !== "all" || roleFilter !== "all"
                    ? "Try adjusting your filters to see more faculty members."
                    : "No faculty members available."}
                </p>
              </div>
            ) : (
              filteredFaculty.map((member) => {
                const stats = getFacultyStats(member.id)
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getRoleIcon(member.role)}
                            <Badge className={getRoleColor(member.role)} variant="secondary">
                              {member.role.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{member.department}</span>
                        </div>
                      </div>

                      {/* Task Statistics */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Task Statistics</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
                            <div className="text-xs text-green-600">Completed</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-lg font-semibold text-blue-600">{stats.inProgress}</div>
                            <div className="text-xs text-blue-600">In Progress</div>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <div className="text-lg font-semibold text-orange-600">{stats.pending}</div>
                            <div className="text-xs text-orange-600">Pending</div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Indicator */}
                      {stats.total > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-medium">{Math.round((stats.completed / stats.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${(stats.completed / stats.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Summary Stats */}
          {filteredFaculty.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Faculty Summary</CardTitle>
                <CardDescription>Overview of faculty performance and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{filteredFaculty.length}</div>
                    <div className="text-sm text-gray-500">Total Faculty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredFaculty.filter((f) => f.role === "iqac").length}
                    </div>
                    <div className="text-sm text-gray-500">IQAC Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredFaculty.filter((f) => f.role === "hod").length}
                    </div>
                    <div className="text-sm text-gray-500">HODs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {filteredFaculty.filter((f) => f.role === "staff").length}
                    </div>
                    <div className="text-sm text-gray-500">Staff Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
