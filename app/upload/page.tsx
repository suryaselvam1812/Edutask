"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  File,
  X,
  Shield,
  Users,
  GraduationCap,
  LogOut,
  FileText,
  ImageIcon,
  Download,
  Trash2,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react"
import Link from "next/link"
import { getTasks, uploadFile, getUploadedFiles, deleteFile, type Task, type UploadedFile } from "@/lib/storage"

export default function UploadPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedTask, setSelectedTask] = useState("")
  const [uploadTitle, setUploadTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const categories = [
    "Assessment Reports",
    "Documentation",
    "Certificates",
    "Presentations",
    "Research Papers",
    "Meeting Minutes",
    "Other",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("iqac_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUserData(parsedUser)
    loadData()
    setLoading(false)
  }, [router])

  const loadData = async () => {
    try {
      const [tasksData, filesData] = await Promise.all([getTasks(), getUploadedFiles()])
      setTasks(tasksData || [])
      setUploadedFiles(filesData || [])
    } catch (error) {
      console.error("Failed to load data:", error)
      setTasks([])
      setUploadedFiles([])
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ]

    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`)
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not supported.`)
      }
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setAlert({ type: "error", message: "Please select at least one file to upload." })
      return
    }

    if (!uploadTitle.trim()) {
      setAlert({ type: "error", message: "Please provide a title for the upload." })
      return
    }

    try {
      validateFiles(selectedFiles)
      setUploading(true)
      setUploadProgress(0)

      const uploadPromises = selectedFiles.map(async (file, index) => {
        const result = await uploadFile(file, selectedTask || undefined, userData?.id, {
          title: uploadTitle,
          description: description || undefined,
          category: category || undefined,
        })

        // Update progress
        setUploadProgress(((index + 1) / selectedFiles.length) * 100)
        return result
      })

      await Promise.all(uploadPromises)

      // Refresh uploaded files list
      await loadData()

      // Reset form
      setSelectedFiles([])
      setUploadTitle("")
      setDescription("")
      setCategory("")
      setSelectedTask("")
      setUploadProgress(0)

      setAlert({ type: "success", message: `Successfully uploaded ${selectedFiles.length} file(s).` })
    } catch (error) {
      console.error("Upload failed:", error)
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Upload failed. Please try again.",
      })
    } finally {
      setUploading(false)
      setTimeout(() => setAlert(null), 5000)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return
    }

    try {
      await deleteFile(fileId)
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
      setAlert({ type: "success", message: "File deleted successfully." })
    } catch (error) {
      console.error("Delete failed:", error)
      setAlert({ type: "error", message: "Failed to delete file. Please try again." })
    } finally {
      setTimeout(() => setAlert(null), 3000)
    }
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

  if (!userData) {
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
                {getRoleIcon(userData.role)}
                <span className="text-sm font-medium text-gray-700">{userData.name}</span>
                <Badge className={getRoleColor(userData.role)}>{userData.role.toUpperCase()}</Badge>
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
              {userData.role === "staff" ? "My Tasks" : "All Tasks"}
            </Link>
            <Link
              href="/faculty"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Faculty
            </Link>
            <Link href="/upload" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Files</h2>
            <p className="text-gray-600">Upload task-related documents and files to the system.</p>
          </div>

          {/* Alert */}
          {alert && (
            <Alert
              className={`mb-6 ${alert.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              {alert.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={alert.type === "error" ? "text-red-800" : "text-green-800"}>
                {alert.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle>Upload New Files</CardTitle>
                <CardDescription>Select files to upload and provide additional information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOC, XLS, PPT, and image files up to 10MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files ({selectedFiles.length})</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upload-title">Upload Title *</Label>
                    <Input
                      id="upload-title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Enter a title for this upload"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="task-select">Associated Task (Optional)</Label>
                    <Select value={selectedTask} onValueChange={setSelectedTask}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description for the uploaded files"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading files...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading || !uploadTitle.trim()}
                  className="w-full"
                >
                  {uploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                </Button>
              </CardContent>
            </Card>

            {/* Previously Uploaded Files */}
            <Card>
              <CardHeader>
                <CardTitle>Previously Uploaded Files</CardTitle>
                <CardDescription>View and manage your uploaded files.</CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                    <p className="text-gray-500">Upload your first file using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getFileIcon(file.file_type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{file.upload_title || file.file_name}</h4>
                              <p className="text-sm text-gray-500">{file.file_name}</p>
                              <p className="text-xs text-gray-400">{formatFileSize(file.file_size)}</p>

                              {file.category && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {file.category}
                                </Badge>
                              )}

                              {file.description && <p className="text-sm text-gray-600 mt-2">{file.description}</p>}

                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                {file.task && (
                                  <div className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {file.task.title}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {file.uploaded_user?.name || "Unknown"}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(file.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(file.file_url, "_blank")}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
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
