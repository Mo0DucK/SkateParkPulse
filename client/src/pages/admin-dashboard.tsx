import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { SkateparkSubmission } from "@/../../shared/schema";

import SEO from "@/components/ui/seo";
import { Button } from "@/components/ui/button";
import { SkateDivider } from "@/components/ui/skate-divider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Status badge variants
const statusVariants = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/submissions'],
    refetchOnWindowFocus: false,
  });
  
  // Filter submissions based on active tab
  const filteredSubmissions = submissions.filter((submission: SkateparkSubmission) => {
    if (activeTab === "all") return true;
    return submission.status === activeTab;
  });
  
  // Stats for the dashboard
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s: SkateparkSubmission) => s.status === "pending").length,
    approved: submissions.filter((s: SkateparkSubmission) => s.status === "approved").length,
    rejected: submissions.filter((s: SkateparkSubmission) => s.status === "rejected").length,
  };

  return (
    <>
      <SEO
        title="Admin Dashboard | SkateparkFinder USA"
        description="Administration dashboard for managing skatepark submissions."
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
          <p className="text-xl text-center mb-4 max-w-3xl">
            Manage and review user-submitted skateparks
          </p>
          <SkateDivider className="w-full max-w-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
              <CardDescription>Total Submissions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-yellow-700 dark:text-yellow-300">{stats.pending}</CardTitle>
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-700 dark:text-green-300">{stats.approved}</CardTitle>
              <CardDescription>Approved</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-red-700 dark:text-red-300">{stats.rejected}</CardTitle>
              <CardDescription>Rejected</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skatepark Submissions</CardTitle>
            <CardDescription>
              Review and manage user-submitted skateparks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <p>Loading submissions...</p>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="flex justify-center py-10">
                    <p>No {activeTab !== "all" ? activeTab : ""} submissions found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Submitter</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((submission: SkateparkSubmission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.id}</TableCell>
                            <TableCell>{submission.name}</TableCell>
                            <TableCell>{`${submission.city}, ${submission.state}`}</TableCell>
                            <TableCell>{submission.submitterName || 'Anonymous'}</TableCell>
                            <TableCell>
                              <Badge className={statusVariants[submission.status]}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/admin/submission/${submission.id}`}>
                                <Button variant="outline" size="sm">
                                  Review
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}