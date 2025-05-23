import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { SkateDivider } from "@/components/ui/skate-divider";
import ParkCard from "@/components/ui/park-card";
import SearchFilter from "@/components/ui/search-filter";
import SEO from "@/components/ui/seo";
import AdUnit from "@/components/ui/ad-unit";
import { type Skatepark } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const PaidParks = () => {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [searchResults, setSearchResults] = useState<Skatepark[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Parse the URL search params on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, [location]);

  // Fetch paid parks
  const { data: paidParks, isLoading } = useQuery<Skatepark[]>({
    queryKey: ['/api/skateparks/paid'],
    enabled: !searchParams?.has('q') && !searchParams?.has('state') && !searchParams?.has('features'),
  });

  // Perform search if parameters exist in the URL
  useEffect(() => {
    const performSearch = async () => {
      if (searchParams && (searchParams.has('q') || searchParams.has('state') || searchParams.has('features'))) {
        setIsSearching(true);
        try {
          const apiUrl = `/api/search?${searchParams.toString()}`;
          const res = await apiRequest('GET', apiUrl);
          const data = await res.json();
          setSearchResults(data.filter((park: Skatepark) => !park.isFree));
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }
    };

    if (searchParams) {
      performSearch();
    }
  }, [searchParams]);

  const handleSearch = (query: string, state: string, parkType: string) => {
    setIsSearching(true);
    
    // Build search URL
    let newSearchParams = new URLSearchParams();
    
    if (query) newSearchParams.append('q', query);
    if (state !== 'All States') newSearchParams.append('state', state);
    if (parkType !== 'All Types') newSearchParams.append('features', parkType);
    
    // Update URL without reloading page
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    setSearchParams(newSearchParams);
  };

  const parksToDisplay = searchResults || paidParks || [];
  const isLoaded = !isLoading && !isSearching;
  const isSearchActive = searchParams && (searchParams.has('q') || searchParams.has('state') || searchParams.has('features'));

  // Create structured data for the paid skateparks page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Paid Skateparks in the USA",
    "description": "Discover premium skateparks that offer top-notch facilities, indoor options, and professional-grade features worth every penny.",
    "url": "https://radramps.com/paid-parks",
    "isPartOf": {
      "@type": "WebSite",
      "name": "RadRamps - Best Skateparks in the USA",
      "url": "https://radramps.com"
    }
  };

  return (
    <>
      {/* SEO Component */}
      <SEO 
        title="Premium Paid Skateparks in the USA | Professional-Grade Parks | RadRamps"
        description="Discover premium skateparks that offer top-notch facilities, indoor options, and professional-grade features worth every penny. Find the best paid skate spots with exceptional maintenance and amenities."
        keywords={[
          'paid skateparks',
          'premium skateparks',
          'professional skateparks',
          'indoor skateparks',
          'competition skateparks',
          'best paid skate parks',
          'top skateparks with admission fee',
          'skate training facilities',
          'professional skate venues',
          'competition-grade skateparks',
          'premium skate facilities',
          'world-class skateparks',
          'paid skate spots near me',
          'paid skateboarding venues'
        ]}
        ogImage="https://pixabay.com/get/g21d7ccc83b7442524c5061c90392ff21c55539f8a1ea12074951ce54d80b7539e45383a733833a870315762e7b062ce20cd5c376ff58456b46e2b393447246b6_1280.jpg"
        ogType="website"
        twitterCard="summary_large_image"
        author="RadRamps Team"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="bg-secondary py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading text-white text-center mb-4">
            PAID <span className="text-primary">SKATEPARKS</span>
          </h1>
          <SkateDivider className="max-w-md mx-auto my-6" />
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            Discover premium skateparks that offer top-notch facilities, indoor options, and professional-grade features worth every penny.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <SearchFilter onSearch={handleSearch} />
      
      {/* Ad Unit after search */}
      <div className="container mx-auto px-4 py-4">
        <AdUnit format="horizontal" slot="6789012345" />
      </div>

      {/* Parks Listing */}
      <section className="py-12 px-4 bg-neutral">
        <div className="container mx-auto">
          {isSearchActive && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading text-secondary mb-4">
                {isLoaded ? (
                  searchResults && searchResults.length > 0 ? 
                  `Found ${searchResults.length} paid skateparks matching your search` : 
                  'No skateparks match your search criteria'
                ) : 'Searching...'}
              </h2>
              <SkateDivider className="mb-8" />
            </div>
          )}

          <div className="mb-8">
            <p className="text-xl font-marker text-center text-primary">
              "Sometimes you gotta pay to play on the premium concrete!"
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {!isLoaded ? (
              // Skeleton loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-48 w-full md:w-1/3" />
                    <div className="w-full md:w-2/3 space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : parksToDisplay.length > 0 ? (
              parksToDisplay.map((park, index) => (
                <ParkCard 
                  key={park.id} 
                  park={park} 
                  horizontal={true} 
                  animationDelay={(index % 4) + 1}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-lg">No paid skateparks found</p>
                {isSearchActive && (
                  <button 
                    onClick={() => {
                      window.location.href = "/paid-parks";
                    }}
                    className="spray-btn mt-4 bg-primary text-white py-2 px-4 rounded-md font-bold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ad Unit after parks listing */}
      <div className="container mx-auto px-4 py-8">
        <AdUnit format="horizontal" slot="7890123456" />
      </div>
    </>
  );
};

export default PaidParks;
