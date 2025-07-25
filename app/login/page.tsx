"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react"
import { authenticateUser } from "@/lib/storage"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("iqac")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const user = await authenticateUser(email, password)

      if (user) {
        localStorage.setItem("edutask_user", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "iqac":
        return {
          icon: <Shield className="h-6 w-6 text-blue-600" />,
          title: "IQAC Login",
          description: "Internal Quality Assurance Cell",
          credentials: "iqac@university.edu / iqac123",
          color: "border-blue-200 bg-blue-50",
        }
      case "hod":
        return {
          icon: <Users className="h-6 w-6 text-green-600" />,
          title: "HOD Login",
          description: "Head of Department",
          credentials: "hod@university.edu / hod123",
          color: "border-green-200 bg-green-50",
        }
      case "staff":
        return {
          icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
          title: "Staff Login",
          description: "Faculty Member",
          credentials: "staff@university.edu / staff123",
          color: "border-purple-200 bg-purple-50",
        }
      default:
        return {
          icon: <Users className="h-6 w-6" />,
          title: "Login",
          description: "",
          credentials: "",
          color: "",
        }
    }
  }

  const roleInfo = getRoleInfo(activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduTask</h1>
          <p className="text-gray-600">Faculty Task Management System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">{roleInfo.icon}</div>
            <CardTitle className="text-xl">{roleInfo.title}</CardTitle>
            <CardDescription>{roleInfo.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="iqac" className="text-xs">
                  IQAC
                </TabsTrigger>
                <TabsTrigger value="hod" className="text-xs">
                  HOD
                </TabsTrigger>
                <TabsTrigger value="staff" className="text-xs">
                  Staff
                </TabsTrigger>
              </TabsList>

              <TabsContent value="iqac">
                <div className={`p-3 rounded-lg mb-4 ${roleInfo.color}`}>
                  <p className="text-sm text-gray-700">
                    <strong>Demo Credentials:</strong>
                    <br />
                    {roleInfo.credentials}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="hod">
                <div className={`p-3 rounded-lg mb-4 ${roleInfo.color}`}>
                  <p className="text-sm text-gray-700">
                    <strong>Demo Credentials:</strong>
                    <br />
                    {roleInfo.credentials}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="staff">
                <div className={`p-3 rounded-lg mb-4 ${roleInfo.color}`}>
                  <p className="text-sm text-gray-700">
                    <strong>Demo Credentials:</strong>
                    <br />
                    {roleInfo.credentials}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-white"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Secure access for authorized personnel only</p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Task Management</p>
            <p className="text-xs text-gray-600">Organize & track tasks</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Quality Assurance</p>
            <p className="text-xs text-gray-600">IQAC compliance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
