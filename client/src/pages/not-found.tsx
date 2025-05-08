import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Search, MapPin } from "lucide-react";
import SEO from "@/components/ui/seo";
import { SkateDivider } from "@/components/ui/skate-divider";

export default function NotFound() {
  // Create structured data for the 404 page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Not Found - RadRamps",
    "description": "The page you're looking for could not be found. Explore our directory of skateparks across the USA instead.",
    "url": "https://radramps.com/404",
    "mainEntity": {
      "@type": "WebSite",
      "name": "RadRamps - Best Skateparks in the USA",
      "url": "https://radramps.com"
    }
  };

  return (
    <>
      <SEO 
        title="Page Not Found - RadRamps Skateparks Directory"
        description="Sorry, the page you're looking for doesn't exist. Explore our directory of the best skateparks across USA instead."
        structuredData={structuredData}
      />
      
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral py-12">
        <Card className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary p-6 text-center">
            <h1 className="text-4xl font-heading text-white">404</h1>
            <SkateDivider className="max-w-xs mx-auto my-4" />
            <p className="text-xl text-white font-bold">PAGE NOT FOUND</p>
          </div>
          
          <CardContent className="pt-8 pb-12 px-8">
            <div className="text-center mb-8">
              <AlertCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Bummer! This page has ollied out of existence.
              </h2>
              <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
                Instead of staying here, why not check out some awesome skateparks?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/" className="flex flex-col items-center p-4 bg-neutral rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Home className="h-8 w-8 text-primary mb-2" />
                <span className="font-bold text-secondary">Home Page</span>
                <span className="text-sm text-gray-600 text-center">Return to the main page</span>
              </Link>
              
              <Link href="/free-parks" className="flex flex-col items-center p-4 bg-neutral rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Search className="h-8 w-8 text-primary mb-2" />
                <span className="font-bold text-secondary">Free Parks</span>
                <span className="text-sm text-gray-600 text-center">Browse free skateparks</span>
              </Link>
              
              <Link href="/paid-parks" className="flex flex-col items-center p-4 bg-neutral rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <span className="font-bold text-secondary">Premium Parks</span>
                <span className="text-sm text-gray-600 text-center">Find premium skateparks</span>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="font-marker text-lg text-primary">
                "The best skaters know how to recover from a fall."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
