"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminProfileSchema, ChangePasswordSchema, type AdminProfileFormData, type ChangePasswordFormData } from '@/lib/schemas';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { toast } = useToast();

  const profileForm = useForm<AdminProfileFormData>({
    resolver: zodResolver(AdminProfileSchema),
    defaultValues: { // Mocked admin data
      name: 'Admin User',
      email: 'admin@example.com',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = (data: AdminProfileFormData) => {
    // Simulate API call
    console.log('Profile data:', data);
    toast({ title: 'Profile Updated', description: 'Your profile information has been updated.' });
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    // Simulate API call
    console.log('Password change data:', data);
    toast({ title: 'Password Changed', description: 'Your password has been successfully changed.' });
    passwordForm.reset();
  };

  return (
    <>
      <PageTitle title="Admin Profile" icon={UserCog} />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Admin User" data-ai-hint="person portrait"/>
                        <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{profileForm.watch('name')}</CardTitle>
                    <CardDescription>{profileForm.watch('email')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">Change Avatar (Not Implemented)</Button>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
