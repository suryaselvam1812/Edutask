"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  FileVideo,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  email: string
  role: string
  name: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadProgress: number
  status: "uploading" | "completed" | "error"
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState({
    taskId: "",
    title: "",
    description: "",
    category: "",
  })

  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.uploadProgress + Math.random() * 30, 100)
            const isComplete = newProgress >= 100
            return {
              ...file,
              uploadProgress: newProgress,
              status: isComplete ? "completed" : "uploading",
            }
          }
          return file
        }),
      )
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, uploadProgress: 100, status: "completed" } : file)),
      )
    }, 3000)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-green-600" />
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-600" />
    if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    if (type.startsWith("video/")) return <FileVideo className="h-5 w-5 text-purple-600" />
    return <File className="h-5 w-5 text-gray-600" />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { formData, files })
    alert("Files uploaded successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem("iqac_user")
    router.push("/login")
  }

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

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
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gray-500 hover:text-gray-700">
                Tasks
              </Link>
              <Link href="/faculty" className="text-gray-500 hover:text-gray-700">
                Faculty
              </Link>
              <Link href="/upload" className="text-blue-600 font-medium">
                Upload
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Files</h2>
          <p className="text-gray-600">Upload documents and files related to your faculty tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
              <CardDescription>Provide details about the task and files you're uploading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskId">Task ID</Label>
                  <Select
                    value={formData.taskId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, taskId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task-001">TASK-001: Course Outcome Assessment</SelectItem>
                      <SelectItem value="task-002">TASK-002: Curriculum Mapping</SelectItem>
                      <SelectItem value="task-003">TASK-003: NAAC Documentation</SelectItem>
                      <SelectItem value="task-004">TASK-004: Faculty Development Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">File Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessment">Assessment Reports</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="certificates">Certificates</SelectItem>
                      <SelectItem value="presentations">Presentations</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Upload Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for this upload"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief description of the files being uploaded"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop files or click to browse. Maximum file size: 10MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG (Max: 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Choose Files
                </Button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-gray-900">Uploaded Files ({files.length})</h3>
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        {file.status === "uploading" && <Progress value={file.uploadProgress} className="mt-2 h-2" />}
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.status === "completed" && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        {file.status === "uploading" && (
                          <Badge className="bg-blue-100 text-blue-800">Uploading...</Badge>
                        )}
                        {file.status === "error" && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={files.length === 0 || files.some((f) => f.status === "uploading")}>
              Submit Upload
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
