export interface Qualification {
  id?: string;
  degree: string;
  passingYear: string; // Changed to string for easier form handling, can be number if strict validation
  college: string;
  specialization: string;
}

export interface Patent {
  id?: string;
  title: string;
  authors: string;
  date: string;
  applicationNumber: string;
  patentOffice: string;
  status: string;
  reference: string;
}

export interface BookChapter {
  id?: string;
  title: string;
  authors: string;
  bookTitle: string;
  publisher: string;
  publicationYear: string;
  doi?: string;
  isbn?: string;
  scopusIndexed: boolean;
  pageNumbers: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  credits?: string;
}

export interface JournalPublication {
  id?: string;
  title: string;
  authors: string;
  journalName: string;
  publicationDate: string;
  volume: string;
  issue?: string;
  pageNumbers: string;
  doi?: string;
  issn?: string;
  indexing?: string;
}

export interface ConferencePublication {
  id?: string;
  title: string;
  authors: string;
  conferenceName: string;
  conferenceDate: string;
  location?: string;
  doi?: string;
  publisher?: string;
  isbn?: string;
  pageNumbers?: string;
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
  patents: Patent[];
  bookChapters: BookChapter[];
  certifications: Certification[];
  internationalJournalPublications: JournalPublication[];
  internationalConferencePublications: ConferencePublication[];
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
