import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { STATES, PARK_FEATURES } from "@/lib/utils";
import { insertSkateparkSubmissionSchema } from "@/../../shared/schema";

import SEO from "@/components/ui/seo";
import AdUnit from "@/components/ui/ad-unit";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SkateDivider } from "@/components/ui/skate-divider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Extend the submission schema with validation rules
const formSchema = insertSkateparkSubmissionSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  submitterEmail: z.string().email("Please enter a valid email address"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "Please select a state"),
  imageUrl: z.union([
    z.string().url("Please enter a valid image URL").includes(["http", ".jpg", ".jpeg", ".png", ".webp"], {
      message: "Please enter a valid image URL (must be a direct link to a JPG, JPEG, PNG or WEBP file)"
    }),
    z.string().max(0)
  ]).optional().nullable(),
});

export default function SubmitPark() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      submitterName: "",
      submitterEmail: "",
      imageUrl: "",
      isFree: true,
      price: "",
      features: [],
    },
  });

  // Submission mutation
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      apiRequest("/api/submit-skatepark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Submission successful!",
        description: "Thanks for submitting your skatepark. We'll review it soon!",
      });
      form.reset();
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your skatepark. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Format price as null when free
    if (data.isFree) {
      data.price = null;
    }
    
    mutation.mutate(data);
  }

  return (
    <>
      <SEO
        title="Submit a Skatepark | SkateparkFinder USA"
        description="Share your favorite skatepark with the skating community. Submit details about a skatepark location to be featured on SkateparkFinder USA."
      />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Submit a Skatepark</h1>
          <p className="text-xl text-center mb-4 max-w-3xl">
            Know about a rad skatepark that's not on our site? Share it with the community!
          </p>
          <SkateDivider className="w-full max-w-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            {submitted ? (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-center text-green-700 dark:text-green-300">
                    Thank You for Your Submission!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center mb-6">
                    Your skatepark submission has been received and will be reviewed by our team.
                    If approved, it will appear on the site within a few days.
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Submit Another Park
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Skatepark Submission Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Skatepark Details</h3>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skatepark Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Venice Beach Skatepark" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the park - what makes it special, what features it has, etc." 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="1800 Ocean Front Walk" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Venice Beach" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {STATES.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/skatepark.jpg" {...field} />
                              </FormControl>
                              <FormDescription>
                                If you have a photo of the park, paste its URL here
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isFree"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Free admission?</FormLabel>
                                <FormDescription>
                                  Check if this park is free to use
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {!form.watch("isFree") && (
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="$10/day" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={form.control}
                          name="features"
                          render={() => (
                            <FormItem>
                              <div className="mb-2">
                                <FormLabel>Features</FormLabel>
                                <FormDescription>
                                  Select all features available at this park
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {PARK_FEATURES.map((feature) => (
                                  <FormField
                                    key={feature}
                                    control={form.control}
                                    name="features"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={feature}
                                          className="flex flex-row items-start space-x-2 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(feature)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, feature])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== feature
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                            {feature}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Your Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="submitterName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tony Hawk" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="submitterEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="tony@example.com" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  We'll contact you if we need more information
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Submitting..." : "Submit Skatepark"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Only submit real skateparks that currently exist</li>
                    <li>Include as many details as possible about the park's features</li>
                    <li>If you have a photo URL, please include it</li>
                    <li>We'll review your submission and add it to our database if approved</li>
                    <li>The review process generally takes 1-3 days</li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <AdUnit format="vertical" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}