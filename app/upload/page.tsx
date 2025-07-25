"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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
  Upload,
  FileText,
  ImageIcon,
  File,
  Download,
  Trash2,
  MoreHorizontal,
  X,
  TrendingUp,
  LogOut,
  Shield,
  Users,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { getTasks, getFiles, uploadFile, deleteFile, type Task, type User, type UploadedFile } from "@/lib/storage"

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null)

  const categories = ["Assessment", "Certificate", "Report", "Documentation", "Research", "Presentation", "Other"]

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
      const [tasksData, filesData] = await Promise.all([getTasks(), getFiles()])
      setTasks(tasksData || [])
      setFiles(filesData || [])
    } catch (error) {
      console.error("Failed to load data:", error)
      setTasks([])
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
    }
  }

  const simulateUpload = async () => {
    if (!selectedFiles || !user || !selectedCategory) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(progress)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          category: selectedCategory,
          task_id: selectedTask || undefined,
          uploaded_by: user.id,
          url: `/placeholder.${file.name.split(".").pop()}`,
        }

        const uploadedFile = await uploadFile(fileData)
        setFiles((prev) => [uploadedFile, ...prev])
      }

      // Reset form
      setSelectedFiles(null)
      setSelectedCategory("")
      setSelectedTask("")
      setUploadProgress(0)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async () => {
    if (!fileToDelete) return

    try {
      await deleteFile(fileToDelete.id)
      setFiles((prev) => prev.filter((file) => file.id !== fileToDelete.id))
      setShowDeleteDialog(false)
      setFileToDelete(null)
    } catch (error) {
      console.error("Failed to delete file:", error)
      alert("Failed to delete file. Please try again.")
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-600" />
    } else if (type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-600" />
    } else {
      return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredTasks = user?.role === "staff" ? tasks.filter((task) => task.assigned_to === user.id) : tasks

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
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">File Upload</h2>
            <p className="text-gray-600">Upload and manage your task-related files</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>Drag and drop files or click to select</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500">Support for PDF, DOC, DOCX, JPG, PNG files up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files ({selectedFiles.length})</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.type)}
                            <span className="text-sm font-medium truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const dt = new DataTransfer()
                              Array.from(selectedFiles).forEach((f, i) => {
                                if (i !== index) dt.items.add(f)
                              })
                              setSelectedFiles(dt.files.length > 0 ? dt.files : null)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="task">Associated Task (Optional)</Label>
                    <Select value={selectedTask} onValueChange={setSelectedTask}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <Button
                    onClick={simulateUpload}
                    disabled={!selectedFiles || !selectedCategory || uploading}
                    className="w-full"
                  >
                    {uploading ? "Uploading..." : "Upload Files"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Files */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
                <CardDescription>Your recently uploaded files</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
                    <p className="text-gray-500">Upload your first file to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {files.slice(0, 10).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {file.category}
                              </Badge>
                              {file.uploaded_user && (
                                <>
                                  <span>•</span>
                                  <span>{file.uploaded_user.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setFileToDelete(file)
                                setShowDeleteDialog(true)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Files */}
          {files.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>All Files ({files.length})</CardTitle>
                <CardDescription>Complete list of uploaded files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        {getFileIcon(file.type)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                            {file.uploaded_user && <span>Uploaded by: {file.uploaded_user.name}</span>}
                            <span>{new Date(file.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFileToDelete(file)
                              setShowDeleteDialog(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
