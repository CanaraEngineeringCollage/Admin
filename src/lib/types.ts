
export interface Qualification {
  id: string;
  degree: string;
  passingYear: string; // Changed to string for easier form handling, can be number if strict validation
  college: string;
  specialization: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string; // Store as ISO string or YYYY-MM-DD
  experience: string; // e.g., "28 Years"
  employmentType: 'Regular' | 'Contract' | 'Visiting';
  qualifications: Qualification[];
  avatar?: string; // Optional: URL to avatar image
}

export interface Buzz {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  imageUrl?: string; // Optional: URL to an image for the buzz item
}

export interface Inquiry {
  id:string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string; // ISO string
  isRead: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
