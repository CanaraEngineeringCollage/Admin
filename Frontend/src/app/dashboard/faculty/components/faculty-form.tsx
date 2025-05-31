"use client";

import { useState } from 'react';
import type { Control, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import type { Faculty } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

interface FacultyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacultyFormData) => void;
  form: UseFormReturn<FacultyFormData>;
}

// Helper component for a generic field array section
interface FieldArraySectionProps<TFieldValues extends FacultyFormData, TName extends keyof TFieldValues> {
  control: Control<TFieldValues>;
  name: TName;
  appendDefault: any; // The default object to append for this section
  renderFields: (control: Control<TFieldValues>, index: number, remove: UseFieldArrayRemove) => React.ReactNode;
  addButtonLabel: string;
}

function FieldArraySection<TFieldValues extends FacultyFormData, TName extends keyof TFieldValues>({
  control,
  name,
  appendDefault,
  renderFields,
  addButtonLabel,
}: FieldArraySectionProps<TFieldValues, TName>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any, // Type assertion needed due to useFieldArray limitations
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="relative rounded-md border p-4 pr-12">
          {renderFields(control, index, remove)}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="absolute right-2 top-2 h-8 w-8 text-destructive hover:text-destructive"
            aria-label={`Remove ${name.toString().slice(0, -1)}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(appendDefault)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> {addButtonLabel}
      </Button>
    </div>
  );
}

// Add UUID generation function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function FacultyForm({ isOpen, onClose, onSubmit, form }: FacultyFormProps) {
  const { control, handleSubmit, formState: { isSubmitting, errors }, trigger, watch } = form;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8; // Added Review step
  const formData = watch();

  const processSubmit = (data: FacultyFormData) => {
    console.log("Form Data Submitted:", data);
    console.log("Form Errors:", errors);
    onSubmit(data);
  };

  const handleNextStep = async () => {
    let isValid = true;
    // Optionally validate current step before proceeding
    if (currentStep === 1) { // Basic Info
      isValid = await trigger(["name", "designation", "department", "joiningDate", "experience", "employmentType", "avatar"]);
    } else if (currentStep === 2) { // Qualifications
      isValid = await trigger(["qualifications"]);
    } // Add more step-specific validations if needed for other steps

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basic Information
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField control={control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Dr. Nagesh H R" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={control} name="designation" render={({ field }) => (<FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g., Professor" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Computer Science & Engineering" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={control} name="joiningDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Joining Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={control} name="experience" render={({ field }) => (<FormItem><FormLabel>Experience</FormLabel><FormControl><Input placeholder="e.g., 28 Years" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={control} name="employmentType" render={({ field }) => (<FormItem><FormLabel>Employment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Regular">Regular</SelectItem><SelectItem value="Contract">Contract</SelectItem><SelectItem value="Visiting">Visiting</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={control} name="avatar" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Avatar URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/100x100.png" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </div>
        );
      case 2: // Qualifications
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Qualifications</h3>
            <FieldArraySection
              control={control}
              name="qualifications"
              appendDefault={{ id: crypto.randomUUID(), degree: '', passingYear: '', college: '', specialization: '' }}
              addButtonLabel="Add Qualification"
              renderFields={(ctrl, index, remove) => (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField control={ctrl} name={`qualifications.${index}.degree` as any} render={({ field }) => (<FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="e.g., B.E." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={ctrl} name={`qualifications.${index}.passingYear` as any} render={({ field }) => (<FormItem><FormLabel>Passing Year</FormLabel><FormControl><Input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="e.g., 1998" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={ctrl} name={`qualifications.${index}.college` as any} render={({ field }) => (<FormItem><FormLabel>College/University</FormLabel><FormControl><Input placeholder="e.g., Karnatak University" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={ctrl} name={`qualifications.${index}.specialization` as any} render={({ field }) => (<FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              )}
            />
          </div>
        );
      case 3: // Patents
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Patent Details</h3>
            <FieldArraySection
              control={control}
              name="patents"
              appendDefault={{ id: crypto.randomUUID(), title: '', authors: '', date: '', applicationNumber: '', patentOffice: '', status: '', reference: '' }}
              addButtonLabel="Add Patent"
              renderFields={(ctrl, index, remove) => (
                <div className="space-y-4">
                  <FormField
                    control={ctrl}
                    name={`patents.${index}.title` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Patent title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`patents.${index}.authors` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Author A, Author B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`patents.${index}.applicationNumber` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Application Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`patents.${index}.patentOffice` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patent Office</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Chennai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`patents.${index}.date` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="e.g., Nov 2024 or YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={ctrl}
                      name={`patents.${index}.status` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Granted, Published" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`patents.${index}.reference` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference/Doc No.</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 107369 / DOC-..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        );
      case 4: // Book Chapters
         return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Book Chapters Published</h3>
            <FieldArraySection
              control={control}
              name="bookChapters"
              appendDefault={{ id: crypto.randomUUID(), title: '', authors: '', bookTitle: '', publisher: '', publicationYear: '', doi: '', isbn: '', scopusIndexed: false, pageNumbers: '' }}
              addButtonLabel="Add Book Chapter"
              renderFields={(ctrl, index, remove) => (
                <div className="space-y-4">
                  <FormField
                    control={ctrl}
                    name={`bookChapters.${index}.title` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Chapter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`bookChapters.${index}.authors` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Author A, Author B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`bookChapters.${index}.bookTitle` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Full title of the book" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`bookChapters.${index}.publisher` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CRC Press" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`bookChapters.${index}.publicationYear` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="e.g., 2022" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`bookChapters.${index}.pageNumbers` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Numbers</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 26-30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={ctrl}
                      name={`bookChapters.${index}.doi` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DOI</FormLabel>
                          <FormControl>
                            <Input placeholder="10.xxxx/xxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`bookChapters.${index}.isbn` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN</FormLabel>
                          <FormControl>
                            <Input placeholder="ISBN number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={ctrl}
                    name={`bookChapters.${index}.scopusIndexed` as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Scopus Indexed</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />
          </div>
        );
      case 5: // Certifications
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Certification Details</h3>
             <FieldArraySection
              control={control}
              name="certifications"
              appendDefault={{ id: crypto.randomUUID(), name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', credits: '' }}
              addButtonLabel="Add Certification"
              renderFields={(ctrl, index, remove) => (
                <div className="space-y-4">
                  <FormField
                    control={ctrl}
                    name={`certifications.${index}.name` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Building Your Leadership Skills" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`certifications.${index}.issuingOrganization` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuing Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Coursera" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={ctrl}
                      name={`certifications.${index}.issueDate` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., September 2023 or YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`certifications.${index}.expiryDate` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`certifications.${index}.credentialId` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Credential ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`certifications.${index}.credentialUrl` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://example.com/credential" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`certifications.${index}.credits` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credits / Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Yes / 3 Days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        );
      case 6: // International Journal Publications
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">International Journal Publications</h3>
            <FieldArraySection
              control={control}
              name="internationalJournalPublications"
              appendDefault={{ id: crypto.randomUUID(), title: '', authors: '', journalName: '', publicationDate: '', volume: '', issue: '', pageNumbers: '', doi: '', issn: '', indexing: '' }}
              addButtonLabel="Add Journal Publication"
              renderFields={(ctrl, index, remove) => (
                <div className="space-y-4">
                  <FormField
                    control={ctrl}
                    name={`internationalJournalPublications.${index}.title` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full title of the paper" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`internationalJournalPublications.${index}.authors` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Author A, Author B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`internationalJournalPublications.${index}.journalName` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Discover Applied Sciences" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.publicationDate` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Date</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dec 2024 or YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.volume` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Vol. 6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.issue` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Issue 12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.pageNumbers` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Numbers</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1-34" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.doi` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DOI (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="10.xxxx/xxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalJournalPublications.${index}.issn` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISSN (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3004-9261" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={ctrl}
                    name={`internationalJournalPublications.${index}.indexing` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indexing (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Scopus, Springer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />
          </div>
        );
      case 7: // International Conference Publications
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">International Conference Publications</h3>
            <FieldArraySection
              control={control}
              name="internationalConferencePublications"
              appendDefault={{ id: crypto.randomUUID(), title: '', authors: '', conferenceName: '', conferenceDate: '', location: '', doi: '', publisher: '', isbn: '', pageNumbers: '' }}
              addButtonLabel="Add Conference Publication"
              renderFields={(ctrl, index, remove) => (
                <div className="space-y-4">
                  <FormField
                    control={ctrl}
                    name={`internationalConferencePublications.${index}.title` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full title of the paper/presentation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`internationalConferencePublications.${index}.authors` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Author A, Author B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ctrl}
                    name={`internationalConferencePublications.${index}.conferenceName` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conference Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., International Conference on Data Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={ctrl}
                      name={`internationalConferencePublications.${index}.conferenceDate` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conference Date</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., July 2024 or YYYY-MM-DD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalConferencePublications.${index}.location` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={ctrl}
                      name={`internationalConferencePublications.${index}.publisher` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., IEEE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalConferencePublications.${index}.isbn` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN/ISSN (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="ISBN or ISSN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={ctrl}
                      name={`internationalConferencePublications.${index}.pageNumbers` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Numbers (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1-7" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={ctrl}
                    name={`internationalConferencePublications.${index}.doi` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DOI (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="10.xxxx/xxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />
          </div>
        );
      case 8: // Review Step
        return (
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Review Details</h3>
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Basic Information</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p>{formData.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{formData.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joining Date</p>
                    <p>{formData.joiningDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p>{formData.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p>{formData.employmentType}</p>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Qualifications</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.qualifications?.map((qual, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Degree:</span> {qual.degree}</p>
                      <p><span className="font-medium">Year:</span> {qual.passingYear}</p>
                      <p><span className="font-medium">College:</span> {qual.college}</p>
                      <p><span className="font-medium">Specialization:</span> {qual.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Patents</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.patents?.map((patent, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Title:</span> {patent.title}</p>
                      <p><span className="font-medium">Authors:</span> {patent.authors}</p>
                      <p><span className="font-medium">Application No:</span> {patent.applicationNumber}</p>
                      <p><span className="font-medium">Status:</span> {patent.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Chapters */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Book Chapters</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.bookChapters?.map((chapter, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Title:</span> {chapter.title}</p>
                      <p><span className="font-medium">Book:</span> {chapter.bookTitle}</p>
                      <p><span className="font-medium">Publisher:</span> {chapter.publisher}</p>
                      <p><span className="font-medium">Year:</span> {chapter.publicationYear}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Certifications</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(5)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.certifications?.map((cert, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Name:</span> {cert.name}</p>
                      <p><span className="font-medium">Organization:</span> {cert.issuingOrganization}</p>
                      <p><span className="font-medium">Issue Date:</span> {cert.issueDate}</p>
                      <p><span className="font-medium">Credential ID:</span> {cert.credentialId}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journal Publications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Journal Publications</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(6)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.internationalJournalPublications?.map((pub, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Title:</span> {pub.title}</p>
                      <p><span className="font-medium">Journal:</span> {pub.journalName}</p>
                      <p><span className="font-medium">Date:</span> {pub.publicationDate}</p>
                      <p><span className="font-medium">Volume:</span> {pub.volume}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conference Publications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Conference Publications</h4>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(7)}>
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.internationalConferencePublications?.map((pub, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <p><span className="font-medium">Title:</span> {pub.title}</p>
                      <p><span className="font-medium">Conference:</span> {pub.conferenceName}</p>
                      <p><span className="font-medium">Date:</span> {pub.conferenceDate}</p>
                      <p><span className="font-medium">Location:</span> {pub.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setCurrentStep(1); } }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.getValues('name') ? 'Edit Faculty' : 'Add New Faculty'} - Step {currentStep} of {totalSteps}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 p-1">
            {renderStepContent()}
            <DialogFooter className="mt-8 pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { onClose(); setCurrentStep(1); }}>
                  Cancel
                </Button>
              </DialogClose>
              
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}

              {currentStep < totalSteps && (
                <Button type="button" onClick={handleNextStep}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {currentStep === totalSteps && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Faculty'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
