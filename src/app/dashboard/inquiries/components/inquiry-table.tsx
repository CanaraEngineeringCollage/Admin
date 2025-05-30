"use client";

import type { Inquiry } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, MailOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface InquiryTableProps {
  inquiries: Inquiry[];
  onView: (inquiry: Inquiry) => void;
  onToggleRead: (inquiryId: string) => void;
}

export function InquiryTable({ inquiries, onView, onToggleRead }: InquiryTableProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="hidden md:table-cell">Received At</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No inquiries found.
              </TableCell>
            </TableRow>
          )}
          {inquiries.map((inquiry) => (
            <TableRow key={inquiry.id} className={cn(!inquiry.isRead && "font-semibold")}>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onToggleRead(inquiry.id)} aria-label={inquiry.isRead ? "Mark as unread" : "Mark as read"}>
                  {inquiry.isRead ? <MailOpen className="h-5 w-5 text-muted-foreground" /> : <Mail className="h-5 w-5 text-primary" />}
                </Button>
              </TableCell>
              <TableCell>{inquiry.name}</TableCell>
              <TableCell className="hidden sm:table-cell">{inquiry.email}</TableCell>
              <TableCell>{inquiry.subject}</TableCell>
              <TableCell className="hidden md:table-cell">{format(parseISO(inquiry.receivedAt), 'dd MMM yyyy, HH:mm')}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onView(inquiry)} aria-label="View inquiry">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
