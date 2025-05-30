"use client";

import type { Faculty } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface FacultyTableProps {
  faculties: Faculty[];
  onEdit: (faculty: Faculty) => void;
  onDelete: (facultyId: string) => void;
}

export function FacultyTable({ faculties, onEdit, onDelete }: FacultyTableProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faculties.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No faculty members found.
              </TableCell>
            </TableRow>
          )}
          {faculties.map((faculty) => (
            <TableRow key={faculty.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={faculty.avatar || `https://placehold.co/40x40.png?text=${faculty.name.charAt(0)}`} alt={faculty.name} data-ai-hint="person portrait" />
                  <AvatarFallback>{faculty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{faculty.name}</TableCell>
              <TableCell>{faculty.designation}</TableCell>
              <TableCell>{faculty.department}</TableCell>
              <TableCell>{format(parseISO(faculty.joiningDate), 'dd MMM yyyy')}</TableCell>
              <TableCell>
                <Badge variant={faculty.employmentType === 'Regular' ? 'default' : 'secondary'}>
                  {faculty.employmentType}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(faculty)} aria-label="Edit faculty">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(faculty.id)} className="text-destructive hover:text-destructive" aria-label="Delete faculty">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
