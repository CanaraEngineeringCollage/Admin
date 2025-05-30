"use client";

import { useState, useEffect } from 'react';
import type { Inquiry } from '@/lib/types';
import { initialInquiries } from '@/lib/data';
import { PageTitle } from '@/components/page-title';
import { InquiryTable } from './components/inquiry-table';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setInquiries(initialInquiries.sort((a, b) => parseISO(b.receivedAt).getTime() - parseISO(a.receivedAt).getTime()));
  }, []);

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.isRead) {
      // Mark as read
      setInquiries(prevInquiries => 
        prevInquiries.map(i => i.id === inquiry.id ? { ...i, isRead: true } : i)
      );
    }
  };
  
  const handleToggleReadStatus = (inquiryId: string) => {
    setInquiries(prevInquiries =>
      prevInquiries.map(inq => {
        if (inq.id === inquiryId) {
          const newReadStatus = !inq.isRead;
          toast({
            title: `Inquiry marked as ${newReadStatus ? "read" : "unread"}`,
            description: `Inquiry from ${inq.name} updated.`,
          });
          return { ...inq, isRead: newReadStatus };
        }
        return inq;
      })
    );
  };

  return (
    <>
      <PageTitle title="View Inquiries" icon={FileText} />
      <InquiryTable inquiries={inquiries} onView={handleViewInquiry} onToggleRead={handleToggleReadStatus} />

      {selectedInquiry && (
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedInquiry.subject}</DialogTitle>
              <DialogDescription>
                From: {selectedInquiry.name} ({selectedInquiry.email}) <br />
                Received: {format(parseISO(selectedInquiry.receivedAt), 'dd MMM yyyy, HH:mm:ss')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">{selectedInquiry.message}</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
