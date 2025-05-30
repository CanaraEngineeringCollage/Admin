"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuzzSchema, type BuzzFormData } from '@/lib/schemas';
import type { Buzz } from '@/lib/types';
import { initialBuzzItems } from '@/lib/data';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { BuzzTable } from './components/buzz-table';
import { BuzzForm } from './components/buzz-form';
import { PlusCircle, Newspaper } from 'lucide-react';
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

export default function BuzzPage() {
  const [buzzItems, setBuzzItems] = useState<Buzz[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBuzz, setEditingBuzz] = useState<Buzz | null>(null);
  const [buzzToDelete, setBuzzToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<BuzzFormData>({
    resolver: zodResolver(BuzzSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
    },
  });

   useEffect(() => {
    // Simulate fetching data
    setBuzzItems(initialBuzzItems);
  }, []);

  const handleAddBuzz = () => {
    setEditingBuzz(null);
    form.reset();
    setIsFormOpen(true);
  };

  const handleEditBuzz = (buzzItem: Buzz) => {
    setEditingBuzz(buzzItem);
    form.reset(buzzItem);
    setIsFormOpen(true);
  };

  const handleDeleteBuzz = (buzzId: string) => {
    setBuzzToDelete(buzzId);
  };
  
  const confirmDeleteBuzz = () => {
    if(buzzToDelete) {
      setBuzzItems(buzzItems.filter((item) => item.id !== buzzToDelete));
      toast({ title: "Buzz Item Deleted", description: "The buzz item has been successfully deleted." });
      setBuzzToDelete(null);
    }
  };

  const onSubmit = (data: BuzzFormData) => {
    const now = new Date().toISOString();
    if (editingBuzz) {
      setBuzzItems(
        buzzItems.map((item) =>
          item.id === editingBuzz.id ? { ...editingBuzz, ...data, updatedAt: now } : item
        )
      );
      toast({ title: "Buzz Item Updated", description: `"${data.title}" has been successfully updated.` });
    } else {
      const newBuzzItem: Buzz = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      setBuzzItems([newBuzzItem, ...buzzItems]); // Add to top for recent first
      toast({ title: "Buzz Item Added", description: `"${data.title}" has been successfully added.` });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <>
      <PageTitle
        title="Manage Buzz"
        icon={Newspaper}
        action={
          <Button onClick={handleAddBuzz}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Buzz Item
          </Button>
        }
      />
      <BuzzTable
        buzzItems={buzzItems}
        onEdit={handleEditBuzz}
        onDelete={handleDeleteBuzz}
      />
      {isFormOpen && (
         <BuzzForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={onSubmit}
            form={form}
        />
      )}
      <AlertDialog open={!!buzzToDelete} onOpenChange={() => setBuzzToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the buzz item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBuzzToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBuzz} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
