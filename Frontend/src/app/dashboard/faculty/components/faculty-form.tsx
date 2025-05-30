
"use client";

import type { Control, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FacultySchema, type FacultyFormData } from '@/lib/schemas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import type { Faculty } from '@/lib/types';

interface FacultyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacultyFormData) => void;
  defaultValues?: Partial<Faculty>;
  form: UseFormReturn<FacultyFormData>;
}

function QualificationsFields({ control, append, remove }: {
  control: Control<FacultyFormData>;
  append: UseFieldArrayAppend<FacultyFormData, "qualifications">;
  remove: UseFieldArrayRemove;
}) {
  const { fields } = useFieldArray({
    control,
    name: "qualifications",
  });

  return (
    <div className="space-y-4">
      <FormLabel>Qualifications</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-5">
          <FormField
            control={control}
            name={`qualifications.${index}.degree`}
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., B. Tech" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`qualifications.${index}.passingYear`}
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Passing Year</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., 1996" 
                    {...field} 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`qualifications.${index}.college`}
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>College/University</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mangalore University" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`qualifications.${index}.specialization`}
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="mt-auto h-10 w-10 self-end lg:col-span-1"
            aria-label="Remove qualification"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ degree: '', passingYear: '', college: '', specialization: '' })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Qualification
      </Button>
    </div>
  );
}


export function FacultyForm({ isOpen, onClose, onSubmit, form }: FacultyFormProps) {
  const { control, handleSubmit, formState: { isSubmitting } } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });
  
  const processSubmit = (data: FacultyFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.getValues('name') ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 p-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dr. Nagesh H R" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science & Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(parseISO(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 28 Years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Visiting">Visiting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type='file' placeholder="https://placehold.co/100x100.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <QualificationsFields control={control} append={append} remove={remove} />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Faculty'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
