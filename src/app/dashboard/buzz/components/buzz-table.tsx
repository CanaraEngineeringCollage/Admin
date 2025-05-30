"use client";

import type { Buzz } from '@/lib/types';
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
import { format, parseISO } from 'date-fns';

interface BuzzTableProps {
  buzzItems: Buzz[];
  onEdit: (buzzItem: Buzz) => void;
  onDelete: (buzzId: string) => void;
}

export function BuzzTable({ buzzItems, onEdit, onDelete }: BuzzTableProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buzzItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No buzz items found.
              </TableCell>
            </TableRow>
          )}
          {buzzItems.map((buzz) => (
            <TableRow key={buzz.id}>
              <TableCell>
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage src={buzz.imageUrl || `https://placehold.co/40x40.png?text=Buzz`} alt={buzz.title} data-ai-hint="event announcement" />
                  <AvatarFallback>{buzz.title.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{buzz.title}</TableCell>
              <TableCell className="hidden md:table-cell">{format(parseISO(buzz.createdAt), 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell className="hidden md:table-cell">{format(parseISO(buzz.updatedAt), 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(buzz)} aria-label="Edit buzz item">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(buzz.id)} className="text-destructive hover:text-destructive" aria-label="Delete buzz item">
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
