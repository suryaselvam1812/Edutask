// Local storage utilities for IQAC SmartTrack
export interface User {
  id: string
  email: string
  name: string
  role: "iqac" | "hod" | "staff"
  department?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assigned_to?: string
  created_by?: string
  department?: string
  due_date?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  created_at: string
  updated_at: string
  assigned_user?: User
  created_user?: User
}

export interface UploadedFile {
  id: string
  task_id?: string
  uploaded_by?: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  upload_title?: string
  description?: string
  category?: string
  status: "uploading" | "uploaded" | "error"
  created_at: string
  task?: Task
  uploaded_user?: User
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    email: "iqac@university.edu",
    name: "IQAC Admin",
    role: "iqac",
    department: "Administration",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "hod@university.edu",
    name: "Prof. Johnson",
    role: "hod",
    department: "Computer Science",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "staff@university.edu",
    name: "Dr. Smith",
    role: "staff",
    department: "Computer Science",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "staff2@university.edu",
    name: "Dr. Brown",
    role: "staff",
    department: "Mathematics",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    email: "staff3@university.edu",
    name: "Prof. Wilson",
    role: "staff",
    department: "Physics",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Initialize default data
const initializeDefaultData = () => {
  if (!localStorage.getItem("iqac_tasks")) {
    const defaultTasks: Task[] = [
      {
        id: "1",
        title: "Prepare Annual Quality Report",
        description: "Compile and prepare the annual quality assurance report for NAAC submission",
        assigned_to: "3",
        created_by: "1",
        department: "Computer Science",
        due_date: "2024-02-15",
        priority: "high",
        status: "in_progress",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Update Curriculum Mapping",
        description: "Review and update the curriculum mapping for the new academic year",
        assigned_to: "4",
        created_by: "1",
        department: "Mathematics",
        due_date: "2024-03-01",
        priority: "medium",
        status: "pending",
        created_at: "2024-01-10T09:00:00Z",
        updated_at: "2024-01-10T09:00:00Z",
      },
      {
        id: "3",
        title: "Faculty Development Program Report",
        description: "Submit report on faculty development programs attended this semester",
        assigned_to: "5",
        created_by: "2",
        department: "Physics",
        due_date: "2024-02-28",
        priority: "low",
        status: "completed",
        created_at: "2024-01-05T14:30:00Z",
        updated_at: "2024-01-20T16:45:00Z",
      },
    ]
    localStorage.setItem("iqac_tasks", JSON.stringify(defaultTasks))
  }

  if (!localStorage.getItem("iqac_files")) {
    const defaultFiles: UploadedFile[] = [
      {
        id: "1",
        task_id: "1",
        uploaded_by: "3",
        file_name: "annual-report-draft.pdf",
        file_size: 2048576,
        file_type: "application/pdf",
        file_url: "/placeholder.svg?height=400&width=600&text=Annual+Report+Draft",
        upload_title: "Annual Report Draft",
        description: "First draft of the annual quality assurance report",
        category: "Assessment Reports",
        status: "uploaded",
        created_at: "2024-01-15T14:30:00Z",
      },
      {
        id: "2",
        task_id: "2",
        uploaded_by: "4",
        file_name: "curriculum-mapping.xlsx",
        file_size: 1024000,
        file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        file_url: "/placeholder.svg?height=400&width=600&text=Curriculum+Mapping",
        upload_title: "Curriculum Mapping Document",
        description: "Updated curriculum mapping for mathematics department",
        category: "Documentation",
        status: "uploaded",
        created_at: "2024-01-12T11:15:00Z",
      },
    ]
    localStorage.setItem("iqac_files", JSON.stringify(defaultFiles))
  }
}

// Auth functions
export async function signInUser(email: string, role: string): Promise<User> {
  const user = mockUsers.find((u) => u.email === email && u.role === role)
  if (!user) {
    throw new Error("Invalid credentials")
  }
  return user
}

// Task functions
export async function getTasks(): Promise<Task[]> {
  initializeDefaultData()
  const tasks = JSON.parse(localStorage.getItem("iqac_tasks") || "[]") as Task[]

  // Add user information to tasks
  return tasks.map((task) => ({
    ...task,
    assigned_user: mockUsers.find((u) => u.id === task.assigned_to),
    created_user: mockUsers.find((u) => u.id === task.created_by),
  }))
}

export async function createTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const tasks = JSON.parse(localStorage.getItem("iqac_tasks") || "[]") as Task[]
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  tasks.unshift(newTask)
  localStorage.setItem("iqac_tasks", JSON.stringify(tasks))

  return {
    ...newTask,
    assigned_user: mockUsers.find((u) => u.id === newTask.assigned_to),
    created_user: mockUsers.find((u) => u.id === newTask.created_by),
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const tasks = JSON.parse(localStorage.getItem("iqac_tasks") || "[]") as Task[]
  const taskIndex = tasks.findIndex((t) => t.id === id)

  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  localStorage.setItem("iqac_tasks", JSON.stringify(tasks))

  return {
    ...tasks[taskIndex],
    assigned_user: mockUsers.find((u) => u.id === tasks[taskIndex].assigned_to),
    created_user: mockUsers.find((u) => u.id === tasks[taskIndex].created_by),
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = JSON.parse(localStorage.getItem("iqac_tasks") || "[]") as Task[]
  const filteredTasks = tasks.filter((t) => t.id !== id)
  localStorage.setItem("iqac_tasks", JSON.stringify(filteredTasks))
  return true
}

// File upload functions
export async function uploadFile(
  file: File,
  taskId?: string,
  userId?: string,
  metadata?: {
    title?: string
    description?: string
    category?: string
  },
): Promise<UploadedFile> {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const files = JSON.parse(localStorage.getItem("iqac_files") || "[]") as UploadedFile[]
  const newFile: UploadedFile = {
    id: Date.now().toString(),
    task_id: taskId,
    uploaded_by: userId,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    file_url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`,
    upload_title: metadata?.title,
    description: metadata?.description,
    category: metadata?.category,
    status: "uploaded",
    created_at: new Date().toISOString(),
  }

  files.unshift(newFile)
  localStorage.setItem("iqac_files", JSON.stringify(files))

  return newFile
}

export async function getUploadedFiles(taskId?: string, userId?: string): Promise<UploadedFile[]> {
  initializeDefaultData()
  let files = JSON.parse(localStorage.getItem("iqac_files") || "[]") as UploadedFile[]

  if (taskId) {
    files = files.filter((f) => f.task_id === taskId)
  }

  if (userId) {
    files = files.filter((f) => f.uploaded_by === userId)
  }

  // Add related data
  const tasks = JSON.parse(localStorage.getItem("iqac_tasks") || "[]") as Task[]

  return files.map((file) => ({
    ...file,
    task: tasks.find((t) => t.id === file.task_id),
    uploaded_user: mockUsers.find((u) => u.id === file.uploaded_by),
  }))
}

export async function deleteFile(fileId: string): Promise<boolean> {
  const files = JSON.parse(localStorage.getItem("iqac_files") || "[]") as UploadedFile[]
  const filteredFiles = files.filter((f) => f.id !== fileId)
  localStorage.setItem("iqac_files", JSON.stringify(filteredFiles))
  return true
}

// Get users for dropdowns
export async function getUsers(role?: string): Promise<User[]> {
  return role ? mockUsers.filter((u) => u.role === role) : mockUsers
}

// Clear all data (for testing)
export function clearAllData(): void {
  localStorage.removeItem("iqac_tasks")
  localStorage.removeItem("iqac_files")
  localStorage.removeItem("iqac_user")
}
