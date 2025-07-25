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
import { Shield, Users, GraduationCap, AlertCircle, TrendingUp } from "lucide-react"
import { signInUser } from "@/lib/storage"

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

    // Simple password validation for demo
    const expectedPasswords = {
      iqac: "iqac123",
      hod: "hod123",
      staff: "staff123",
    }

    if (password !== expectedPasswords[activeTab as keyof typeof expectedPasswords]) {
      setError("Invalid credentials")
      setLoading(false)
      return
    }

    try {
      const user = await signInUser(email, activeTab)
      localStorage.setItem("iqac_user", JSON.stringify(user))
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid credentials")
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
          email: "iqac@university.edu",
          color: "border-blue-200 bg-blue-50",
        }
      case "hod":
        return {
          icon: <Users className="h-6 w-6 text-green-600" />,
          title: "HOD Login",
          description: "Head of Department",
          email: "hod@university.edu",
          color: "border-green-200 bg-green-50",
        }
      case "staff":
        return {
          icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
          title: "Staff Login",
          description: "Faculty Member",
          email: "staff@university.edu",
          color: "border-purple-200 bg-purple-50",
        }
      default:
        return {
          icon: <Users className="h-6 w-6" />,
          title: "Login",
          description: "",
          email: "",
          color: "",
        }
    }
  }

  const roleInfo = getRoleInfo(activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">IQAC SmartTrack</h1>
          </div>
          <p className="text-gray-600">Quality Assurance Management System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className={`flex items-center justify-center p-3 rounded-lg ${roleInfo.color}`}>
              {roleInfo.icon}
              <div className="ml-3">
                <CardTitle className="text-xl">{roleInfo.title}</CardTitle>
                <CardDescription>{roleInfo.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="iqac" className="text-xs">
                  <Shield className="h-4 w-4 mr-1" />
                  IQAC
                </TabsTrigger>
                <TabsTrigger value="hod" className="text-xs">
                  <Users className="h-4 w-4 mr-1" />
                  HOD
                </TabsTrigger>
                <TabsTrigger value="staff" className="text-xs">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Staff
                </TabsTrigger>
              </TabsList>

              {["iqac", "hod", "staff"].map((role) => (
                <TabsContent key={role} value={role} className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={getRoleInfo(role).email}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full"
                        placeholder={`Enter ${role} password`}
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : `Sign in as ${role.toUpperCase()}`}
                    </Button>
                  </form>

                  {/* Demo credentials */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Email: {getRoleInfo(role).email}</p>
                      <p>Password: {role}123</p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Key Features:</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-500" />
              Task Management
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-500" />
              Faculty Tracking
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-purple-500" />
              File Upload
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
              Progress Reports
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
