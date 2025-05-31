import { z } from 'zod';

export const QualificationSchema = z.object({
  id: z.string().optional(), // Optional for new qualifications
  degree: z.string().min(1, 'Degree is required'),
  passingYear: z.string().min(4, 'Valid passing year is required').max(4),
  college: z.string().min(1, 'College/University is required'),
  specialization: z.string().min(1, 'Area of specialization is required'),
});

export const PatentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  date: z.string().min(1, 'Date is required'),
  applicationNumber: z.string().min(1, 'Application number is required'),
  patentOffice: z.string().min(1, 'Patent office is required'),
  status: z.string().min(1, 'Status is required'),
  reference: z.string().min(1, 'Reference is required'),
});

export const BookChapterSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  bookTitle: z.string().min(1, 'Book title is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  publicationYear: z.string().min(4, 'Valid publication year is required').max(4),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  scopusIndexed: z.boolean().default(false),
  pageNumbers: z.string().min(1, 'Page numbers are required'),
});

export const CertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().min(1, 'Credential ID is required'),
  credentialUrl: z.string().url().optional(),
  credits: z.string().optional(),
});

export const JournalPublicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  journalName: z.string().min(1, 'Journal name is required'),
  publicationDate: z.string().min(1, 'Publication date is required'),
  volume: z.string().min(1, 'Volume is required'),
  issue: z.string().optional(),
  pageNumbers: z.string().min(1, 'Page numbers are required'),
  doi: z.string().optional(),
  issn: z.string().optional(),
  indexing: z.string().optional(),
});

export const ConferencePublicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  conferenceName: z.string().min(1, 'Conference name is required'),
  conferenceDate: z.string().min(1, 'Conference date is required'),
  location: z.string().optional(),
  doi: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  pageNumbers: z.string().optional(),
});

export const FacultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  joiningDate: z.string().min(1, 'Joining date is required'), // Can be refined with z.date() if using a date picker that provides Date objects
  experience: z.string().min(1, 'Experience is required'),
  employmentType: z.enum(['Regular', 'Contract', 'Visiting']),
  qualifications: z.array(QualificationSchema).min(1, 'At least one qualification is required'),
  avatar: z.string().url().optional().or(z.literal('')),
  patents: z.array(PatentSchema).default([]),
  bookChapters: z.array(BookChapterSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  internationalJournalPublications: z.array(JournalPublicationSchema).default([]),
  internationalConferencePublications: z.array(ConferencePublicationSchema).default([]),
});

export type FacultyFormData = z.infer<typeof FacultySchema>;

export const BuzzSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type BuzzFormData = z.infer<typeof BuzzSchema>;

export const AdminProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type AdminProfileFormData = z.infer<typeof AdminProfileSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"], // path of error
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
