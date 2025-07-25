import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment and have the required env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a mock client if env vars are not available
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Mock Supabase client for development without actual Supabase setup
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }) }),
      }),
      insert: () => ({
        select: () => ({ single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }) }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          }),
        }),
      }),
      delete: () => ({ eq: () => Promise.resolve({ error: new Error("Supabase not configured") }) }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.jpg" } }),
        remove: () => Promise.resolve({ error: new Error("Supabase not configured") }),
      }),
    },
  }
}

export { supabase }

// Database types
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

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Auth functions with fallback
export async function signInUser(email: string, role: string) {
  if (!isSupabaseConfigured()) {
    // Mock authentication for development
    const mockUsers = [
      { id: "1", email: "iqac@university.edu", name: "IQAC Admin", role: "iqac", department: "Administration" },
      { id: "2", email: "hod@university.edu", name: "HOD User", role: "hod", department: "Computer Science" },
      { id: "3", email: "staff@university.edu", name: "Staff Member", role: "staff", department: "Computer Science" },
    ]

    const user = mockUsers.find((u) => u.email === email && u.role === role)
    if (!user) {
      throw new Error("Invalid credentials")
    }
    return { ...user, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  }

  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("role", role).single()

  if (error) {
    throw new Error("Invalid credentials")
  }

  return data
}

// Task functions with fallback
export async function getTasks() {
  if (!isSupabaseConfigured()) {
    // Mock tasks for development
    return [
      {
        id: "1",
        title: "Prepare Annual Report",
        description: "Compile and prepare the annual quality assurance report",
        assigned_to: "3",
        created_by: "1",
        department: "Computer Science",
        due_date: "2024-02-15",
        priority: "high" as const,
        status: "in_progress" as const,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        assigned_user: { name: "Dr. Smith", email: "smith@university.edu", department: "Computer Science" },
        created_user: { name: "IQAC Admin", email: "iqac@university.edu" },
      },
      {
        id: "2",
        title: "Update Curriculum",
        description: "Review and update the curriculum for the new academic year",
        assigned_to: "2",
        created_by: "1",
        department: "Computer Science",
        due_date: "2024-03-01",
        priority: "medium" as const,
        status: "pending" as const,
        created_at: "2024-01-10T09:00:00Z",
        updated_at: "2024-01-10T09:00:00Z",
        assigned_user: { name: "Prof. Johnson", email: "johnson@university.edu", department: "Computer Science" },
        created_user: { name: "IQAC Admin", email: "iqac@university.edu" },
      },
    ]
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      assigned_user:assigned_to(name, email, department),
      created_user:created_by(name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Failed to fetch tasks")
  }

  return data
}

export async function createTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">) {
  if (!isSupabaseConfigured()) {
    // Mock task creation
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newTask
  }

  const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

  if (error) {
    throw new Error("Failed to create task")
  }

  return data
}

export async function updateTask(id: string, updates: Partial<Task>) {
  if (!isSupabaseConfigured()) {
    // Mock task update
    return { ...updates, id, updated_at: new Date().toISOString() }
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error("Failed to update task")
  }

  return data
}

// File upload functions with fallback
export async function uploadFile(
  file: File,
  taskId?: string,
  userId?: string,
  metadata?: {
    title?: string
    description?: string
    category?: string
  },
) {
  if (!isSupabaseConfigured()) {
    // Mock file upload
    return {
      id: Date.now().toString(),
      task_id: taskId,
      uploaded_by: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: "/placeholder.jpg",
      upload_title: metadata?.title,
      description: metadata?.description,
      category: metadata?.category,
      status: "uploaded" as const,
      created_at: new Date().toISOString(),
    }
  }

  try {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("task-files").upload(filePath, file)

    if (uploadError) {
      throw new Error("Failed to upload file to storage")
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("task-files").getPublicUrl(filePath)

    // Save file metadata to database
    const { data: fileData, error: dbError } = await supabase
      .from("uploaded_files")
      .insert([
        {
          task_id: taskId,
          uploaded_by: userId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_url: publicUrl,
          upload_title: metadata?.title,
          description: metadata?.description,
          category: metadata?.category,
          status: "uploaded",
        },
      ])
      .select()
      .single()

    if (dbError) {
      throw new Error("Failed to save file metadata")
    }

    return fileData
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

export async function getUploadedFiles(taskId?: string, userId?: string) {
  if (!isSupabaseConfigured()) {
    // Mock uploaded files
    return [
      {
        id: "1",
        task_id: "1",
        uploaded_by: "3",
        file_name: "annual-report-draft.pdf",
        file_size: 2048576,
        file_type: "application/pdf",
        file_url: "/placeholder.jpg",
        upload_title: "Annual Report Draft",
        description: "First draft of the annual report",
        category: "Assessment Reports",
        status: "uploaded" as const,
        created_at: "2024-01-15T14:30:00Z",
        task: {
          title: "Prepare Annual Report",
          description: "Compile and prepare the annual quality assurance report",
        },
        uploaded_user: { name: "Dr. Smith", email: "smith@university.edu" },
      },
    ]
  }

  let query = supabase
    .from("uploaded_files")
    .select(`
      *,
      task:task_id(title, description),
      uploaded_user:uploaded_by(name, email)
    `)
    .order("created_at", { ascending: false })

  if (taskId) {
    query = query.eq("task_id", taskId)
  }

  if (userId) {
    query = query.eq("uploaded_by", userId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error("Failed to fetch uploaded files")
  }

  return data
}

export async function deleteFile(fileId: string) {
  if (!isSupabaseConfigured()) {
    // Mock file deletion
    return true
  }

  // First get the file data to get the file path
  const { data: fileData, error: fetchError } = await supabase
    .from("uploaded_files")
    .select("file_url")
    .eq("id", fileId)
    .single()

  if (fetchError) {
    throw new Error("Failed to fetch file data")
  }

  // Extract file path from URL
  const filePath = fileData.file_url.split("/").pop()

  // Delete from storage
  const { error: storageError } = await supabase.storage.from("task-files").remove([`uploads/${filePath}`])

  if (storageError) {
    console.error("Failed to delete from storage:", storageError)
  }

  // Delete from database
  const { error: dbError } = await supabase.from("uploaded_files").delete().eq("id", fileId)

  if (dbError) {
    throw new Error("Failed to delete file record")
  }

  return true
}

// Get users for dropdowns
export async function getUsers(role?: string) {
  if (!isSupabaseConfigured()) {
    // Mock users
    const mockUsers = [
      {
        id: "1",
        name: "IQAC Admin",
        email: "iqac@university.edu",
        role: "iqac",
        department: "Administration",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Prof. Johnson",
        email: "johnson@university.edu",
        role: "hod",
        department: "Computer Science",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        name: "Dr. Smith",
        email: "smith@university.edu",
        role: "staff",
        department: "Computer Science",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "4",
        name: "Dr. Brown",
        email: "brown@university.edu",
        role: "staff",
        department: "Mathematics",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ]

    return role ? mockUsers.filter((u) => u.role === role) : mockUsers
  }

  let query = supabase.from("users").select("*").order("name")

  if (role) {
    query = query.eq("role", role)
  }

  const { data, error } = await query

  if (error) {
    throw new Error("Failed to fetch users")
  }

  return data
}
