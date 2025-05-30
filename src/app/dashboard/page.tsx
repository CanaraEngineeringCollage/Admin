'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { UsersRound, Newspaper, FileText, LayoutDashboard } from 'lucide-react';
import { initialFaculties, initialBuzzItems, initialInquiries } from '@/lib/data';
import type { Faculty, Buzz, Inquiry } from '@/lib/types';

export default function DashboardPage() {
  const [facultyCount, setFacultyCount] = useState(0);
  const [buzzCount, setBuzzCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    // In a real app, fetch this data
    setFacultyCount(initialFaculties.length);
    setBuzzCount(initialBuzzItems.length);
    setInquiryCount(initialInquiries.length);
  }, []);

  return (
    <>
      <PageTitle title="Dashboard" icon={LayoutDashboard} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <UsersRound className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyCount}</div>
            <p className="text-xs text-muted-foreground">Currently active faculty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buzz Items</CardTitle>
            <Newspaper className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buzzCount}</div>
            <p className="text-xs text-muted-foreground">Published announcements and news</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries Received</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiryCount}</div>
            <p className="text-xs text-muted-foreground">Total inquiries from website visitors</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent updates and additions.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity feed or charts */}
            <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">New Faculty Added</h3>
                    <p className="text-sm text-muted-foreground">Dr. Emily Carter joined the Physics department.</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold">Upcoming Event: Seminar</h3>
                    <p className="text-sm text-muted-foreground">Seminar on Quantum Computing scheduled for next week.</p>
                     <p className="text-xs text-muted-foreground">Posted 1 day ago</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
