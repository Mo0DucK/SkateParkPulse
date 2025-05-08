import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { SkateDivider } from "@/components/ui/skate-divider";
import { formatRating } from "@/lib/utils";
import { type Skatepark } from "@shared/schema";
import SEO from "@/components/ui/seo";
import AdUnit from "@/components/ui/ad-unit";

const ParkDetails = () => {
  const params = useParams<{ id: string }>();
  const parkId = parseInt(params.id);

  const { data: park, isLoading, error } = useQuery<Skatepark>({
    queryKey: [`/api/skateparks/${parkId}`],
    enabled: !isNaN(parkId),
  });

  if (isNaN(parkId)) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-heading text-secondary mb-4">Invalid Park ID</h1>
        <p className="mb-8">The skatepark ID provided is not valid.</p>
        <Link 
          href="/" 
          className="spray-btn bg-primary text-white py-2 px-6 rounded-md font-bold"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-heading text-secondary mb-4">Park Not Found</h1>
        <p className="mb-8">We couldn't find the skatepark you're looking for.</p>
        <Link 
          href="/" 
          className="spray-btn bg-primary text-white py-2 px-6 rounded-md font-bold"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const renderRatingStars = (rating: number) => {
    const ratingNum = parseInt(formatRating(rating));
    const hasHalfStar = rating % 10 >= 5;
    
    const stars = [];
    for (let i = 0; i < ratingNum; i++) {
      stars.push(<i key={i} className="fas fa-star text-[#ff9800] text-xl"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-[#ff9800] text-xl"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-[#ff9800] text-xl"></i>);
    }
    
    return stars;
  };

  return (
    <>
      {/* Add SEO when park data is loaded */}
      {!isLoading && park && (
        <SEO
          title={`${park.name} Skatepark - ${park.city}, ${park.state} | RadRamps`}
          description={`Visit ${park.name} in ${park.city}, ${park.state}. ${park.isFree ? 'Free admission' : `Admission: ${park.price}`}. Features: ${park.features.slice(0, 3).join(', ')}. ${park.description.substring(0, 120)}...`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            "name": park.name,
            "description": park.description,
            "image": park.imageUrl,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": park.address,
              "addressLocality": park.city,
              "addressRegion": park.state,
              "addressCountry": "US"
            },
            "url": `https://radramps.com/park/${park.id}`,
            "priceRange": park.isFree ? "Free" : park.price,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": formatRating(park.rating),
              "ratingCount": "25",
              "bestRating": "5",
              "worstRating": "1"
            },
            "amenityFeature": park.features.map(feature => ({
              "@type": "LocationFeatureSpecification",
              "name": feature,
              "value": true
            }))
          }}
        />
      )}
          
      {isLoading || !park ? (
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-20 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Park Hero */}
          <div className="bg-secondary py-8 px-4">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-3xl md:text-5xl font-heading text-white">{park.name}</h1>
                <span className={`text-xl font-bold ${park.isFree ? "text-accent" : "text-primary"} mt-2 md:mt-0`}>
                  {park.isFree ? "FREE" : park.price}
                </span>
              </div>
              <div className="flex items-center text-white mb-2">
                <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                <span>{park.address}, {park.city}, {park.state}</span>
              </div>
              <div className="flex items-center text-white">
                {renderRatingStars(park.rating)}
                <span className="ml-2 text-xl">{formatRating(park.rating)}</span>
              </div>
            </div>
          </div>

          {/* Park Image */}
          <div className="relative h-96 overflow-hidden">
            <img 
              src={park.imageUrl} 
              alt={park.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Ad Unit after image */}
          <div className="container mx-auto px-4 py-4">
            <AdUnit format="horizontal" slot="1234567890" />
          </div>

          {/* Park Details */}
          <section className="py-12 px-4 bg-neutral">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-heading text-secondary mb-4">About This Park</h2>
                  <SkateDivider className="mb-6" />
                  <p className="text-gray-700 mb-6 text-lg">
                    {park.description}
                  </p>
                  
                  <h3 className="text-xl font-bold text-secondary mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {park.features.map((feature, index) => (
                      <span key={index} className="bg-secondary text-white px-3 py-1 text-sm rounded-md">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary mb-3">Location</h3>
                  <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                    <div className="flex items-start">
                      <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary"></i>
                      <div>
                        <p className="font-bold">{park.name}</p>
                        <p>{park.address}</p>
                        <p>{park.city}, {park.state}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${park.name} ${park.address} ${park.city} ${park.state}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spray-btn bg-secondary text-white py-2 px-4 rounded-md font-bold"
                      >
                        <i className="fas fa-directions mr-2"></i> Get Directions
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-secondary mb-4">Park Information</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <i className="fas fa-money-bill mr-3 text-primary w-6"></i>
                        <span>
                          <strong>Admission:</strong> {park.isFree ? "Free" : park.price}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-star mr-3 text-primary w-6"></i>
                        <span>
                          <strong>Rating:</strong> {formatRating(park.rating)}/5.0
                        </span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-tags mr-3 text-primary w-6"></i>
                        <span>
                          <strong>Type:</strong> {park.features.slice(0, 2).join(", ")}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-map-marked-alt mr-3 text-primary w-6"></i>
                        <span>
                          <strong>Region:</strong> {park.state}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-secondary mb-4">Actions</h3>
                    <div className="space-y-3">
                      <a 
                        href="#" 
                        className="spray-btn block w-full bg-primary text-white py-2 px-4 rounded-md font-bold text-center"
                      >
                        <i className="fas fa-thumbs-up mr-2"></i> Rate This Park
                      </a>
                      <a 
                        href="#" 
                        className="spray-btn block w-full bg-secondary text-white py-2 px-4 rounded-md font-bold text-center"
                      >
                        <i className="fas fa-camera mr-2"></i> Add Photos
                      </a>
                      <a 
                        href="#" 
                        className="spray-btn block w-full bg-accent text-white py-2 px-4 rounded-md font-bold text-center"
                      >
                        <i className="fas fa-share-alt mr-2"></i> Share
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Link 
                  href={park.isFree ? "/free-parks" : "/paid-parks"} 
                  className="spray-btn bg-secondary text-white py-3 px-8 rounded-md font-bold text-lg"
                >
                  <i className="fas fa-arrow-left mr-2"></i> 
                  Back to {park.isFree ? "Free" : "Paid"} Parks
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ParkDetails;
