import type { Faculty, Buzz, Inquiry } from './types';

export const initialFaculties: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Nagesh H R',
    designation: 'Principal',
    department: 'Computer Science & Engineering',
    joiningDate: '2023-10-16',
    experience: '28 Years',
    employmentType: 'Regular',
    qualifications: [
      { id: 'q1', degree: 'B. Tech', passingYear: '1996', college: 'Mangalore University', specialization: 'Computer Science & Engineering' },
      { id: 'q2', degree: 'M. Tech', passingYear: '2002', college: 'NITK Surathkal', specialization: 'Computer Science & Engineering' },
      { id: 'q3', degree: 'PhD', passingYear: '2008', college: 'NITK Surathkal', specialization: 'Computer Science & Engineering' },
    ],
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'Dr. Jane Doe',
    designation: 'Professor',
    department: 'Electronics & Communication',
    joiningDate: '2010-08-20',
    experience: '14 Years',
    employmentType: 'Regular',
    qualifications: [
      { id: 'q4', degree: 'B.E.', passingYear: '2005', college: 'VTU Belgaum', specialization: 'Electronics & Communication' },
      { id: 'q5', degree: 'M.E.', passingYear: '2007', college: 'IISc Bangalore', specialization: 'Signal Processing' },
      { id: 'q6', degree: 'PhD', passingYear: '2010', college: 'IISc Bangalore', specialization: 'Wireless Communication' },
    ],
    avatar: 'https://placehold.co/100x100.png',
  },
];

export const initialBuzzItems: Buzz[] = [
  {
    id: 'b1',
    title: 'Annual Tech Fest "Innovate 2024"',
    content: 'Get ready for Innovate 2024, our annual technology festival! Dates: March 15-17. Exciting events, workshops, and competitions await. Registrations open soon.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'b2',
    title: 'Guest Lecture on AI Ethics',
    content: 'Join us for an insightful guest lecture on "The Ethical Implications of Artificial Intelligence" by Dr. Alex Chen. Date: February 5th, 2024. Venue: Auditorium A.',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

export const initialInquiries: Inquiry[] = [
  {
    id: 'i1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    subject: 'Admission Query for B.Tech CSE',
    message: 'Hello, I would like to know more about the admission process for the B.Tech Computer Science program, specifically regarding eligibility criteria and important dates. Thank you.',
    receivedAt: '2024-01-22T09:15:00Z',
    isRead: false,
  },
  {
    id: 'i2',
    name: 'Alice Wonderland',
    email: 'alice.w@example.com',
    subject: 'Hostel Facilities',
    message: 'Could you please provide details about the hostel facilities available for first-year students? I am interested in room sharing options and amenities.',
    receivedAt: '2024-01-21T16:45:00Z',
    isRead: true,
  },
];
