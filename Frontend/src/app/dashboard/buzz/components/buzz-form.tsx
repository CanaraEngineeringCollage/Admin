"use client";

import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuzzSchema, type BuzzFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Buzz } from '@/lib/types';

interface BuzzFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BuzzFormData) => void;
  defaultValues?: Partial<Buzz>;
  form: UseFormReturn<BuzzFormData>;
}

export function BuzzForm({ isOpen, onClose, onSubmit, form }: BuzzFormProps) {
  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const processSubmit = (data: BuzzFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.getValues('title') ? 'Edit Buzz Item' : 'Add New Buzz Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 p-1">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Tech Fest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the buzz item..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image upload</FormLabel>
                  <FormControl>
                    <Input type='file' placeholder="https://placehold.co/600x400.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Buzz Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
