// Local storage-based data management without Supabase

export interface User {
  id: string
  name: string
  email: string
  role: "iqac" | "hod" | "staff"
  department: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assigned_to?: string
  assigned_user?: User
  created_by: string
  created_user?: User
  department?: string
  due_date?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  created_at: string
  updated_at: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  category: string
  task_id?: string
  uploaded_by: string
  uploaded_user?: User
  created_at: string
  url: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. IQAC Coordinator",
    email: "iqac@university.edu",
    role: "iqac",
    department: "Quality Assurance",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Computer Science HOD",
    email: "hod@university.edu",
    role: "hod",
    department: "Computer Science",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Prof. John Smith",
    email: "staff@university.edu",
    role: "staff",
    department: "Computer Science",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Dr. Sarah Johnson",
    email: "sarah@university.edu",
    role: "staff",
    department: "Mathematics",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Prof. Michael Brown",
    email: "michael@university.edu",
    role: "staff",
    department: "Physics",
    created_at: new Date().toISOString(),
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Submit Course Outcome Assessment Report",
    description: "Prepare and submit the course outcome assessment report for the current semester",
    assigned_to: "3",
    created_by: "1",
    department: "Computer Science",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Faculty Development Program Attendance",
    description: "Attend the upcoming faculty development program on modern teaching methodologies",
    assigned_to: "4",
    created_by: "2",
    department: "Mathematics",
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Research Publication Documentation",
    description: "Submit documentation for recent research publications for NAAC assessment",
    assigned_to: "5",
    created_by: "1",
    department: "Physics",
    due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "Course_Assessment_Report.pdf",
    size: 2048576,
    type: "application/pdf",
    category: "Assessment",
    task_id: "1",
    uploaded_by: "3",
    created_at: new Date().toISOString(),
    url: "/placeholder.pdf",
  },
  {
    id: "2",
    name: "Faculty_Development_Certificate.jpg",
    size: 1024768,
    type: "image/jpeg",
    category: "Certificate",
    task_id: "2",
    uploaded_by: "4",
    created_at: new Date().toISOString(),
    url: "/placeholder.jpg",
  },
]

// Initialize data in localStorage
const initializeData = () => {
  if (!localStorage.getItem("edutask_users")) {
    localStorage.setItem("edutask_users", JSON.stringify(mockUsers))
  }
  if (!localStorage.getItem("edutask_tasks")) {
    localStorage.setItem("edutask_tasks", JSON.stringify(mockTasks))
  }
  if (!localStorage.getItem("edutask_files")) {
    localStorage.setItem("edutask_files", JSON.stringify(mockFiles))
  }
}

// User functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  initializeData()

  // Mock authentication - in real app, this would be secure
  const validCredentials = [
    { email: "iqac@university.edu", password: "iqac123", userId: "1" },
    { email: "hod@university.edu", password: "hod123", userId: "2" },
    { email: "staff@university.edu", password: "staff123", userId: "3" },
  ]

  const credential = validCredentials.find((c) => c.email === email && c.password === password)
  if (!credential) return null

  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")
  return users.find((user: User) => user.id === credential.userId) || null
}

export const getUsers = async (role?: string): Promise<User[]> => {
  initializeData()
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")
  return role ? users.filter((user: User) => user.role === role) : users
}

export const getUserById = async (id: string): Promise<User | null> => {
  const users = await getUsers()
  return users.find((user) => user.id === id) || null
}

// Task functions
export const getTasks = async (): Promise<Task[]> => {
  initializeData()
  const tasks = JSON.parse(localStorage.getItem("edutask_tasks") || "[]")
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")

  // Populate user data
  return tasks.map((task: Task) => ({
    ...task,
    assigned_user: task.assigned_to ? users.find((u: User) => u.id === task.assigned_to) : undefined,
    created_user: users.find((u: User) => u.id === task.created_by),
  }))
}

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const tasks = JSON.parse(localStorage.getItem("edutask_tasks") || "[]")
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")

  const newTask: Task = {
    id: Date.now().toString(),
    title: taskData.title || "",
    description: taskData.description,
    assigned_to: taskData.assigned_to,
    created_by: taskData.created_by || "",
    department: taskData.department,
    due_date: taskData.due_date,
    priority: taskData.priority || "medium",
    status: taskData.status || "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Populate user data
  newTask.assigned_user = newTask.assigned_to ? users.find((u: User) => u.id === newTask.assigned_to) : undefined
  newTask.created_user = users.find((u: User) => u.id === newTask.created_by)

  tasks.unshift(newTask)
  localStorage.setItem("edutask_tasks", JSON.stringify(tasks))

  return newTask
}

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const tasks = JSON.parse(localStorage.getItem("edutask_tasks") || "[]")
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")

  const taskIndex = tasks.findIndex((task: Task) => task.id === id)
  if (taskIndex === -1) throw new Error("Task not found")

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  // Populate user data
  tasks[taskIndex].assigned_user = tasks[taskIndex].assigned_to
    ? users.find((u: User) => u.id === tasks[taskIndex].assigned_to)
    : undefined
  tasks[taskIndex].created_user = users.find((u: User) => u.id === tasks[taskIndex].created_by)

  localStorage.setItem("edutask_tasks", JSON.stringify(tasks))

  return tasks[taskIndex]
}

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = JSON.parse(localStorage.getItem("edutask_tasks") || "[]")
  const filteredTasks = tasks.filter((task: Task) => task.id !== id)
  localStorage.setItem("edutask_tasks", JSON.stringify(filteredTasks))
}

// File functions
export const getFiles = async (): Promise<UploadedFile[]> => {
  initializeData()
  const files = JSON.parse(localStorage.getItem("edutask_files") || "[]")
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")

  // Populate user data
  return files.map((file: UploadedFile) => ({
    ...file,
    uploaded_user: users.find((u: User) => u.id === file.uploaded_by),
  }))
}

export const uploadFile = async (fileData: Partial<UploadedFile>): Promise<UploadedFile> => {
  const files = JSON.parse(localStorage.getItem("edutask_files") || "[]")
  const users = JSON.parse(localStorage.getItem("edutask_users") || "[]")

  const newFile: UploadedFile = {
    id: Date.now().toString(),
    name: fileData.name || "",
    size: fileData.size || 0,
    type: fileData.type || "",
    category: fileData.category || "Other",
    task_id: fileData.task_id,
    uploaded_by: fileData.uploaded_by || "",
    created_at: new Date().toISOString(),
    url: fileData.url || "/placeholder.pdf",
  }

  // Populate user data
  newFile.uploaded_user = users.find((u: User) => u.id === newFile.uploaded_by)

  files.unshift(newFile)
  localStorage.setItem("edutask_files", JSON.stringify(files))

  return newFile
}

export const deleteFile = async (id: string): Promise<void> => {
  const files = JSON.parse(localStorage.getItem("edutask_files") || "[]")
  const filteredFiles = files.filter((file: UploadedFile) => file.id !== id)
  localStorage.setItem("edutask_files", JSON.stringify(filteredFiles))
}
