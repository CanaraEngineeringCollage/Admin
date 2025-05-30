import { z } from 'zod';

export const QualificationSchema = z.object({
  id: z.string().optional(), // Optional for new qualifications
  degree: z.string().min(1, 'Degree is required'),
  passingYear: z.string().min(4, 'Valid passing year is required').max(4),
  college: z.string().min(1, 'College/University is required'),
  specialization: z.string().min(1, 'Area of specialization is required'),
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
