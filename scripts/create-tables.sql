-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('iqac', 'hod', 'staff')),
  department VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  department VARCHAR(255),
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  upload_title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploading', 'uploaded', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample users
INSERT INTO users (email, name, role, department) VALUES
('iqac@university.edu', 'IQAC Administrator', 'iqac', 'Quality Assurance'),
('hod@university.edu', 'Dr. John Smith', 'hod', 'Computer Science'),
('staff@university.edu', 'Prof. Sarah Johnson', 'staff', 'Computer Science')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, assigned_to, created_by, department, due_date, priority, status) 
SELECT 
  'Course Outcome Assessment',
  'Complete the course outcome assessment for all subjects in the current semester',
  (SELECT id FROM users WHERE email = 'staff@university.edu'),
  (SELECT id FROM users WHERE email = 'iqac@university.edu'),
  'Computer Science',
  CURRENT_DATE + INTERVAL '30 days',
  'high',
  'pending'
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Course Outcome Assessment');

INSERT INTO tasks (title, description, assigned_to, created_by, department, due_date, priority, status) 
SELECT 
  'NAAC Documentation',
  'Prepare documentation for NAAC accreditation process',
  (SELECT id FROM users WHERE email = 'staff@university.edu'),
  (SELECT id FROM users WHERE email = 'hod@university.edu'),
  'Computer Science',
  CURRENT_DATE + INTERVAL '45 days',
  'high',
  'in_progress'
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'NAAC Documentation');
