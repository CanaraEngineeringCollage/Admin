
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, UsersRound, XCircle } from 'lucide-react';
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

const employmentTypes: Faculty['employmentType'][] = ['Regular', 'Contract', 'Visiting'];

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<Faculty['employmentType'] | ''>('');
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);

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

  useEffect(() => {
    const departments = Array.from(new Set(faculties.map(f => f.department)));
    setUniqueDepartments(departments.sort());
  }, [faculties]);

  useEffect(() => {
    let items = [...faculties];

    if (selectedDepartment) {
      items = items.filter(f => f.department === selectedDepartment);
    }

    if (selectedEmploymentType) {
      items = items.filter(f => f.employmentType === selectedEmploymentType);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      items = items.filter(f =>
        f.name.toLowerCase().includes(lowerSearchTerm) ||
        f.designation.toLowerCase().includes(lowerSearchTerm) ||
        f.department.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredFaculties(items);
  }, [faculties, searchTerm, selectedDepartment, selectedEmploymentType]);

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    form.reset({
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
      setFaculties(
        faculties.map((f) =>
          f.id === editingFaculty.id ? { ...editingFaculty, ...data, qualifications: data.qualifications as Qualification[] } : f
        )
      );
      toast({ title: "Faculty Updated", description: `${data.name} has been successfully updated.` });
    } else {
      const newFaculty: Faculty = {
        id: crypto.randomUUID(),
        ...data,
        qualifications: data.qualifications as Qualification[],
      };
      setFaculties([newFaculty, ...faculties].sort((a, b) => a.name.localeCompare(b.name))); // Add and sort
      toast({ title: "Faculty Added", description: `${data.name} has been successfully added.` });
    }
    setIsFormOpen(false);
    form.reset();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedEmploymentType('');
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

      <div className="mb-6 mt-4 p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="facultySearch" className="text-sm font-medium">Search Faculty</Label>
            <Input
              id="facultySearch"
              placeholder="Search by name, designation, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="departmentFilter" className="text-sm font-medium">Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger id="departmentFilter" className="mt-1">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employmentTypeFilter" className="text-sm font-medium">Employment Type</Label>
            <Select value={selectedEmploymentType} onValueChange={(value) => setSelectedEmploymentType(value as Faculty['employmentType'] | '')}>
              <SelectTrigger id="employmentTypeFilter" className="mt-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {employmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || selectedDepartment || selectedEmploymentType) && (
             <Button variant="outline" onClick={handleClearFilters} className="w-full lg:w-auto mt-4 lg:mt-0">
                <XCircle className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
          )}
        </div>
      </div>

      <FacultyTable
        faculties={filteredFaculties}
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
