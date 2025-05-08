import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { SkateDivider } from "@/components/ui/skate-divider";
import ParkCard from "@/components/ui/park-card";
import SearchFilter from "@/components/ui/search-filter";
import AdUnit from "@/components/ui/ad-unit";
import SEO from "@/components/ui/seo";
import { type Skatepark } from "@shared/schema";

const Home = () => {
  const { data: featuredParks, isLoading: featuredLoading } = useQuery<Skatepark[]>({
    queryKey: ['/api/skateparks/featured'],
  });

  const { data: freeParks, isLoading: freeLoading } = useQuery<Skatepark[]>({
    queryKey: ['/api/skateparks/free'],
  });

  const { data: paidParks, isLoading: paidLoading } = useQuery<Skatepark[]>({
    queryKey: ['/api/skateparks/paid'],
  });

  const handleSearch = (query: string, state: string, parkType: string) => {
    // Build search URL
    let searchParams = new URLSearchParams();
    
    if (query) searchParams.append('q', query);
    if (state !== 'All States') searchParams.append('state', state);
    if (parkType !== 'All Types') searchParams.append('features', parkType);
    
    // Navigate to free parks page with search params
    window.location.href = `/free-parks?${searchParams.toString()}`;
  };

  // Create structured data for the website
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RadRamps - Best Skateparks in the USA",
    "url": "https://radramps.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://radramps.com/free-parks?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "description": "Discover the best skateparks across the United States with RadRamps. Find free and paid skateparks with detailed information about features, locations, and ratings."
  };

  // Create structured data for organization
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RadRamps",
    "url": "https://radramps.com",
    "logo": "https://radramps.com/logo.png",
    "sameAs": [
      "https://instagram.com/radramps",
      "https://twitter.com/radramps",
      "https://youtube.com/radramps"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "email": "info@radramps.com"
    }
  };

  // Combined structured data
  const structuredData = [websiteStructuredData, organizationStructuredData];

  return (
    <>
      {/* SEO Component */}
      <SEO 
        title="Best Skateparks in the USA"
        description="Discover the best skateparks across the United States with RadRamps. Find free and paid skateparks with detailed information about features, locations, and ratings."
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div 
        className="relative h-[80vh] overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://pixabay.com/get/g189d51ed10caead6af49c628963029f5c3522495d50bcbb8994678a1542453a0d3c11980b24681b227b0a1c802784523d6a2a5086dc1af101a68266232f17cee_1280.jpg')" 
        }}
      >
        <div className="absolute inset-0 bg-dark bg-opacity-50"></div>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-4 uppercase">
              Find The <span className="text-primary">Best</span> Skateparks<br/>
              Across The USA
            </h1>
            <p className="text-lg md:text-xl text-accent mb-8 max-w-2xl font-semibold">
              Your ultimate guide to shredding the best concrete waves from coast to coast.
              Discover hidden gems, legendary spots, and local favorites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/free-parks" 
                className="spray-btn bg-primary text-white font-bold py-3 px-8 rounded-md uppercase tracking-wider text-center transform hover:shadow-lg transition-all"
              >
                Free Parks
              </Link>
              <Link 
                href="/paid-parks" 
                className="spray-btn bg-secondary border-2 border-white text-white font-bold py-3 px-8 rounded-md uppercase tracking-wider text-center transform hover:shadow-lg transition-all"
              >
                Paid Parks
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full">
          <SkateDivider />
        </div>
      </div>

      {/* Search Section */}
      <SearchFilter onSearch={handleSearch} />
      
      {/* Ad Unit after search */}
      <div className="container mx-auto px-4">
        <AdUnit format="horizontal" slot="1234567890" />
      </div>

      {/* Featured Parks Section */}
      <section className="py-12 px-4 bg-neutral" id="featured">
        <div className="container mx-auto">
          <div className="flex items-center mb-10">
            <h2 className="text-3xl font-heading text-secondary uppercase">Featured Parks</h2>
            <div className="ml-4 h-1 flex-grow bg-primary"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredLoading ? (
              <>
                <div className="space-y-3">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </>
            ) : featuredParks && featuredParks.length > 0 ? (
              featuredParks.map((park, index) => (
                <ParkCard 
                  key={park.id} 
                  park={park} 
                  featured={true} 
                  animationDelay={(index % 4) + 1}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-lg">No featured parks found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Free Skateparks Preview */}
      <section className="py-12 px-4 bg-white" id="free-preview">
        <div className="container mx-auto">
          <div className="flex items-center mb-10">
            <div className="mr-4 h-1 flex-grow bg-accent"></div>
            <h2 className="text-3xl font-heading text-secondary uppercase">Free Parks</h2>
            <div className="ml-4 h-1 flex-grow bg-accent"></div>
          </div>
          
          <div className="mb-8">
            <p className="text-xl font-marker text-center text-primary">"The best things in life are free... especially concrete!"</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {freeLoading ? (
              <>
                <div className="space-y-3">
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
              </>
            ) : freeParks && freeParks.length > 0 ? (
              freeParks.slice(0, 2).map((park, index) => (
                <ParkCard 
                  key={park.id} 
                  park={park} 
                  horizontal={true} 
                  animationDelay={(index % 4) + 1}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-lg">No free parks found</p>
              </div>
            )}
            
            <div className="text-center mt-6">
              <Link 
                href="/free-parks" 
                className="spray-btn inline-block bg-secondary text-white py-3 px-8 rounded-md font-bold text-lg uppercase"
              >
                View All Free Parks <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Unit between sections */}
      <div className="container mx-auto px-4 py-4">
        <AdUnit format="horizontal" slot="2345678901" />
      </div>

      {/* Paid Skateparks Preview */}
      <section className="py-12 px-4 bg-neutral" id="paid-preview">
        <div className="container mx-auto">
          <div className="flex items-center mb-10">
            <div className="mr-4 h-1 flex-grow bg-primary"></div>
            <h2 className="text-3xl font-heading text-secondary uppercase">Paid Parks</h2>
            <div className="ml-4 h-1 flex-grow bg-primary"></div>
          </div>
          
          <div className="mb-8">
            <p className="text-xl font-marker text-center text-primary">"Sometimes you gotta pay to play on the premium concrete!"</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {paidLoading ? (
              <>
                <div className="space-y-3">
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
              </>
            ) : paidParks && paidParks.length > 0 ? (
              paidParks.slice(0, 2).map((park, index) => (
                <ParkCard 
                  key={park.id} 
                  park={park} 
                  horizontal={true} 
                  animationDelay={(index % 4) + 1}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-lg">No paid parks found</p>
              </div>
            )}
            
            <div className="text-center mt-6">
              <Link 
                href="/paid-parks" 
                className="spray-btn inline-block bg-secondary text-white py-3 px-8 rounded-md font-bold text-lg uppercase"
              >
                View All Paid Parks <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading text-white uppercase text-center mb-10">Skate Gallery</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="overflow-hidden rounded-md">
              <img 
                src="https://pixabay.com/get/gd3513333be5c873f1362f17f2eb80e228f3254f6f0df83de663d559d3130dbcc05481bd6e876f313f08901b924bf144225a6569b3c142394510b86ff98566ed5_1280.jpg" 
                alt="Skateboarder doing a trick" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="overflow-hidden rounded-md">
              <img 
                src="https://images.unsplash.com/photo-1621544402532-78c290378588?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Skateboarder grinding" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="overflow-hidden rounded-md">
              <img 
                src="https://pixabay.com/get/g58357ee2812651c1634b8bf587c7e302d8521b5be94db92052515fa4f236feca9335a01012d8fa9698134ceed3a317a670cfe66da25c3e3056be2452542bf4f7_1280.jpg" 
                alt="Empty skatepark with ramps" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="overflow-hidden rounded-md">
              <img 
                src="https://images.unsplash.com/photo-1536318431364-5cc762cfc8ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Skateboarder on a quarter pipe" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ad Unit after gallery */}
      <div className="container mx-auto px-4 py-4">
        <AdUnit format="horizontal" slot="3456789012" />
      </div>

      {/* Community Section */}
      <section className="py-12 px-4 bg-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5">
          <div className="w-full h-full"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center mb-10">
            <div className="mr-4 h-1 flex-grow bg-primary"></div>
            <h2 className="text-3xl font-heading text-secondary uppercase">Join The Community</h2>
            <div className="ml-4 h-1 flex-grow bg-primary"></div>
          </div>
          
          <div className="text-center mb-10">
            <p className="text-xl">
              Help other skaters find the best spots. Share your experiences and contribute to our growing database.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-4xl mb-4">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Add a Skatepark</h3>
              <p className="text-gray-700 mb-4">
                Know a spot that's not on our map? Add it to help others discover it.
              </p>
              <Link 
                href="#" 
                className="spray-btn inline-block bg-secondary text-white py-2 px-4 rounded-md font-bold"
              >
                Submit a Park
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-4xl mb-4">
                <i className="fas fa-camera"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Share Photos</h3>
              <p className="text-gray-700 mb-4">
                Upload your best shots to help others see what parks are really like.
              </p>
              <Link 
                href="#" 
                className="spray-btn inline-block bg-secondary text-white py-2 px-4 rounded-md font-bold"
              >
                Upload Photos
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-primary text-4xl mb-4">
                <i className="fas fa-star"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Write Reviews</h3>
              <p className="text-gray-700 mb-4">
                Rate and review parks you've visited to help other skaters know what to expect.
              </p>
              <Link 
                href="#" 
                className="spray-btn inline-block bg-secondary text-white py-2 px-4 rounded-md font-bold"
              >
                Review a Park
              </Link>
            </div>
          </div>
          
          <div className="mt-12 bg-secondary rounded-lg p-8 text-center">
            <h3 className="text-2xl font-heading text-white mb-4">Stay Updated</h3>
            <p className="text-white mb-6">
              Subscribe to our newsletter for the latest park openings, events, and skateboarding news.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="spray-btn bg-primary text-white py-3 px-8 rounded-md font-bold uppercase tracking-wider">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
