"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FacultySchema, type FacultyFormData } from '@/lib/schemas';
import type { Faculty, Qualification } from '@/lib/types';
import { initialFaculties } from '@/lib/data';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { FacultyTable } from './components/faculty-table';
import { FacultyForm } from './components/faculty-form';
import { PlusCircle, UsersRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(FacultySchema),
    defaultValues: {
      name: '',
      designation: '',
      department: '',
      joiningDate: '',
      experience: '',
      employmentType: 'Regular',
      qualifications: [{ degree: '', passingYear: '', college: '', specialization: '' }],
      avatar: '',
    },
  });

 useEffect(() => {
    // Simulate fetching data
    setFaculties(initialFaculties);
  }, []);

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    form.reset({ // Reset with default structure including one qualification
      name: '',
      designation: '',
      department: '',
      joiningDate: '',
      experience: '',
      employmentType: 'Regular',
      qualifications: [{ id: crypto.randomUUID(), degree: '', passingYear: '', college: '', specialization: '' }],
      avatar: '',
    });
    setIsFormOpen(true);
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    // Ensure qualifications have unique IDs for useFieldArray if they don't already
    const qualificationsWithIds = faculty.qualifications.map(q => ({ ...q, id: q.id || crypto.randomUUID() }));
    form.reset({ ...faculty, qualifications: qualificationsWithIds });
    setIsFormOpen(true);
  };

  const handleDeleteFaculty = (facultyId: string) => {
    setFacultyToDelete(facultyId);
  };

  const confirmDeleteFaculty = () => {
    if (facultyToDelete) {
      setFaculties(faculties.filter((f) => f.id !== facultyToDelete));
      toast({ title: "Faculty Deleted", description: "The faculty member has been successfully deleted." });
      setFacultyToDelete(null);
    }
  };

  const onSubmit = (data: FacultyFormData) => {
    if (editingFaculty) {
      // Update existing faculty
      setFaculties(
        faculties.map((f) =>
          f.id === editingFaculty.id ? { ...editingFaculty, ...data, qualifications: data.qualifications as Qualification[] } : f
        )
      );
      toast({ title: "Faculty Updated", description: `${data.name} has been successfully updated.` });
    } else {
      // Add new faculty
      const newFaculty: Faculty = {
        id: crypto.randomUUID(),
        ...data,
        qualifications: data.qualifications as Qualification[],
      };
      setFaculties([...faculties, newFaculty]);
      toast({ title: "Faculty Added", description: `${data.name} has been successfully added.` });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <>
      <PageTitle
        title="Manage Faculty"
        icon={UsersRound}
        action={
          <Button onClick={handleAddFaculty}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Faculty
          </Button>
        }
      />
      <FacultyTable
        faculties={faculties}
        onEdit={handleEditFaculty}
        onDelete={handleDeleteFaculty}
      />
      {isFormOpen && (
        <FacultyForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={onSubmit}
          form={form}
        />
      )}
      <AlertDialog open={!!facultyToDelete} onOpenChange={() => setFacultyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the faculty member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFacultyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFaculty} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
