import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SkateparkSubmission } from "@/../../shared/schema";

import SEO from "@/components/ui/seo";
import { SkateDivider } from "@/components/ui/skate-divider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Status badge variants
const statusVariants = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function SubmissionDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/submission/:id");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState("");
  
  // Get submission details
  const submissionId = params?.id ? parseInt(params.id) : 0;
  
  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['/api/admin/submissions', submissionId],
    queryFn: () => apiRequest(`/api/admin/submissions/${submissionId}`),
    enabled: !!submissionId,
  });
  
  // Mutation for updating submission status
  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => apiRequest(
      `/api/admin/submissions/${submissionId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reviewNotes }),
      }
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions', submissionId] });
      
      toast({
        title: `Submission ${data.submission.status}`,
        description: `The skatepark submission has been ${data.submission.status}.`,
      });
      
      // Redirect back to admin dashboard after short delay
      setTimeout(() => {
        setLocation("/admin");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update submission status. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Handle status update
  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ status });
  };
  
  if (isLoading) return (
    <div className="container mx-auto py-16 px-4 text-center">
      <p>Loading submission details...</p>
    </div>
  );
  
  if (error || !submission) return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Error Loading Submission</h1>
      <p>Could not load the submission details. The submission may not exist or there was an error.</p>
      <Button className="mt-6" onClick={() => setLocation("/admin")}>
        Return to Dashboard
      </Button>
    </div>
  );

  return (
    <>
      <SEO
        title={`Review Submission: ${submission.name} | SkateparkFinder USA`}
        description="Review and process a skatepark submission."
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Review Submission</h1>
          <p className="text-xl text-center mb-4 max-w-3xl">
            Submission #{submission.id}: {submission.name}
          </p>
          <SkateDivider className="w-full max-w-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{submission.name}</CardTitle>
                  <Badge className={statusVariants[submission.status as keyof typeof statusVariants]}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  Submitted on {new Date(submission.createdAt).toLocaleDateString()} by {submission.submitterName || 'Anonymous'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Park Details</TabsTrigger>
                    <TabsTrigger value="submitter">Submitter Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6 pt-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
                        {submission.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Location</h3>
                        <div className="space-y-1">
                          <p><span className="font-medium">Address:</span> {submission.address}</p>
                          <p><span className="font-medium">City:</span> {submission.city}</p>
                          <p><span className="font-medium">State:</span> {submission.state}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Details</h3>
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium">Admission:</span> {submission.isFree ? 'Free' : `Paid (${submission.price})`}
                          </p>
                          <p>
                            <span className="font-medium">Features:</span> {submission.features?.join(', ') || 'None specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {submission.imageUrl && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Image</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Important:</strong> Please verify this is a relevant, high-quality image of the actual skatepark.
                        </p>
                        <div className="relative h-80 w-full overflow-hidden rounded-lg">
                          <img
                            src={submission.imageUrl}
                            alt={submission.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://placehold.co/600x400?text=Image+Not+Available";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="submitter" className="space-y-6 pt-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Submitter Information</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Name:</span> {submission.submitterName || 'Not provided'}</p>
                        <p><span className="font-medium">Email:</span> {submission.submitterEmail}</p>
                      </div>
                    </div>
                    
                    {submission.reviewNotes && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Review Notes</h3>
                        <p className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
                          {submission.reviewNotes}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {submission.status === "pending" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Review Decision</CardTitle>
                  <CardDescription>
                    Approve or reject this skatepark submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Review Notes (optional)</h3>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Reject Submission</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reject the skatepark submission. Common reasons for rejection:
                          <ul className="list-disc list-inside mt-2">
                            <li>Information is incomplete or inaccurate</li>
                            <li>The image is not relevant or is low quality</li>
                            <li>The skatepark doesn't exist or is already in our database</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleStatusUpdate("rejected")}
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">Approve Submission</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve this submission?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will approve the skatepark submission and add it to the public listing.
                          <br/><br/>
                          <strong>Please confirm:</strong>
                          <ul className="list-disc list-inside mt-2">
                            <li>All information is accurate and complete</li>
                            <li>The image is a relevant, high-quality photo of the actual skatepark</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusUpdate("approved")}
                        >
                          Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/admin")}
                >
                  Back to Dashboard
                </Button>
                
                {submission.status !== "pending" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusUpdate("pending")}
                    disabled={updateStatusMutation.isPending}
                  >
                    Reset to Pending
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}