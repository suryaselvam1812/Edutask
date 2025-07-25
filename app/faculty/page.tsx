"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Plus, Search, TrendingUp, UserIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  email: string
  role: string
  name: string
}

export default function FacultyPage() {
  const [searchTerm, setSearchTerm] = useState("")
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

  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      department: "Computer Science",
      designation: "Professor",
      activeTasks: 3,
      completedTasks: 15,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1 (555) 234-5678",
      department: "Electronics",
      designation: "Associate Professor",
      activeTasks: 2,
      completedTasks: 12,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      email: "emily.davis@university.edu",
      phone: "+1 (555) 345-6789",
      department: "Mathematics",
      designation: "Assistant Professor",
      activeTasks: 1,
      completedTasks: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Prof. Robert Wilson",
      email: "robert.wilson@university.edu",
      phone: "+1 (555) 456-7890",
      department: "Physics",
      designation: "Professor",
      activeTasks: 4,
      completedTasks: 20,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      email: "lisa.anderson@university.edu",
      phone: "+1 (555) 567-8901",
      department: "Chemistry",
      designation: "Associate Professor",
      activeTasks: 2,
      completedTasks: 14,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Prof. David Kumar",
      email: "david.kumar@university.edu",
      phone: "+1 (555) 678-9012",
      department: "Mechanical Engineering",
      designation: "Professor",
      activeTasks: 3,
      completedTasks: 18,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredFaculty = facultyMembers.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
              <Link href="/tasks" className="text-gray-500 hover:text-gray-700">
                Tasks
              </Link>
              <Link href="/faculty" className="text-blue-600 font-medium">
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Faculty Members</h2>
          <p className="text-gray-600">Manage faculty profiles and track their task assignments</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search faculty by name, department, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Faculty Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={faculty.avatar || "/placeholder.svg"} alt={faculty.name} />
                    <AvatarFallback>{getInitials(faculty.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{faculty.name}</CardTitle>
                    <CardDescription>{faculty.designation}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {faculty.department}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{faculty.email}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{faculty.phone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{faculty.activeTasks}</p>
                      <p className="text-xs text-gray-500">Active Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{faculty.completedTasks}</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <UserIcon className="h-4 w-4 mr-1" />
                      Profile
                    </Button>
                    <Button size="sm" className="flex-1">
                      Assign Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No faculty members found matching your search.</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty Member
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
