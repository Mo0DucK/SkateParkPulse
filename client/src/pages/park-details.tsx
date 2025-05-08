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
          title={`${park.name} Skatepark - ${park.city}, ${park.state} | Visit & Skate Today`}
          description={`Visit ${park.name} in ${park.city}, ${park.state}. ${park.isFree ? 'Free admission' : `Admission: ${park.price}`}. Features: ${park.features.slice(0, 3).join(', ')}. ${park.description.substring(0, 120)}...`}
          keywords={[
            `${park.name.toLowerCase()}`, 
            `${park.name.toLowerCase()} skatepark`, 
            `${park.city.toLowerCase()} skateparks`, 
            `${park.state.toLowerCase()} skateparks`, 
            `${park.isFree ? 'free' : 'paid'} skateparks`,
            ...park.features.map(f => f.toLowerCase()),
            'skate spots',
            'skateboarding location',
            'best skatepark',
            park.isFree ? 'free skate parks' : 'skateboard park admission',
            'skate park directions'
          ]}
          ogImage={park.imageUrl}
          ogType="article"
          twitterCard="summary_large_image"
          author="RadRamps Team"
          datePublished="2025-05-01T12:00:00+00:00"
          dateModified="2025-05-08T12:00:00+00:00"
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
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": park.latitude,
              "longitude": park.longitude
            },
            "url": `https://radramps.com/park/${park.id}`,
            "priceRange": park.isFree ? "Free" : park.price,
            "telephone": "+1-800-555-5555",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ],
              "opens": "09:00",
              "closes": "21:00"
            },
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
            })),
            "photo": {
              "@type": "ImageObject",
              "url": park.imageUrl,
              "width": "1280",
              "height": "720"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://radramps.com/park/${park.id}`
            },
            "additionalType": "https://schema.org/TouristAttraction"
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
                  <h2 className="text-2xl font-heading text-secondary mb-4">About {park.name} Skatepark</h2>
                  <SkateDivider className="mb-6" />
                  <p className="text-gray-700 mb-6 text-lg">
                    {park.description}
                  </p>
                  
                  {/* Additional keyword-rich content */}
                  <div className="text-gray-700 mb-6">
                    <p className="mb-4">
                      <strong>{park.name}</strong> is one of the most popular skateparks in {park.city}, {park.state}. 
                      Located at {park.address}, this {park.isFree ? "free" : "paid"} skatepark offers a 
                      range of features including {park.features.join(", ")}. Whether you're a beginner 
                      or professional skateboarder, {park.name} has something for everyone.
                    </p>
                    
                    <p>
                      Skateboarding enthusiasts from all over {park.state} visit {park.name} to enjoy 
                      the well-maintained ramps, rails, and obstacles. With a user rating of {formatRating(park.rating)}/5, 
                      it's consistently ranked among the best skateparks in the area. Don't forget to bring your 
                      skateboard and protective gear when visiting this amazing skate spot!
                    </p>
                  </div>
                  
                  {/* In-content ad */}
                  <div className="my-8">
                    <AdUnit format="in-article" slot="3456789012" />
                  </div>
                  
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

          {/* Related Skateparks Section */}
          <section className="py-12 px-4 bg-white">
            <div className="container mx-auto">
              <h2 className="text-3xl font-heading text-secondary mb-6 text-center">
                Other Skateparks In {park.state}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* In a real implementation, we would fetch related parks by state */}
                {/* For now, just show fixed content to improve SEO */}
                <div className="bg-neutral rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://pixabay.com/get/g58357ee2812651c1634b8bf587c7e302d8521b5be94db92052515fa4f236feca9335a01012d8fa9698134ceed3a317a670cfe66da25c3e3056be2452542bf4f7_1280.jpg" 
                      alt="Similar skatepark in the area" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">Local Community Skatepark</h3>
                    <p className="text-sm text-gray-600 mb-2">{park.city}, {park.state}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-primary text-white px-2 py-0.5 text-xs rounded-md">Free</span>
                      <span className="bg-neutral border border-gray-300 px-2 py-0.5 text-xs rounded-md">Beginner-Friendly</span>
                    </div>
                    <Link href="/park/1" className="text-primary font-bold text-sm hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="bg-neutral rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://pixabay.com/get/g21d7ccc83b7442524c5061c90392ff21c55539f8a1ea12074951ce54d80b7539e45383a733833a870315762e7b062ce20cd5c376ff58456b46e2b393447246b6_1280.jpg" 
                      alt="Indoor skatepark nearby" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">Indoor Training Facility</h3>
                    <p className="text-sm text-gray-600 mb-2">{park.city}, {park.state}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-secondary text-white px-2 py-0.5 text-xs rounded-md">Paid</span>
                      <span className="bg-neutral border border-gray-300 px-2 py-0.5 text-xs rounded-md">Indoor</span>
                    </div>
                    <Link href="/park/2" className="text-primary font-bold text-sm hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="bg-neutral rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://pixabay.com/get/gd3513333be5c873f1362f17f2eb80e228f3254f6f0df83de663d559d3130dbcc05481bd6e876f313f08901b924bf144225a6569b3c142394510b86ff98566ed5_1280.jpg" 
                      alt="Skatepark with bowls" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">Pro Bowl Skatepark</h3>
                    <p className="text-sm text-gray-600 mb-2">{park.city}, {park.state}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-primary text-white px-2 py-0.5 text-xs rounded-md">Free</span>
                      <span className="bg-neutral border border-gray-300 px-2 py-0.5 text-xs rounded-md">Bowl</span>
                    </div>
                    <Link href="/park/3" className="text-primary font-bold text-sm hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link 
                  href={park.isFree ? "/free-parks" : "/paid-parks"} 
                  className="spray-btn bg-secondary text-white py-2 px-6 rounded-md font-bold"
                >
                  Explore More {park.state} Skateparks
                </Link>
              </div>
            </div>
          </section>
          
          {/* FAQ Section for SEO */}
          <section className="py-12 px-4 bg-neutral">
            <div className="container mx-auto">
              <h2 className="text-3xl font-heading text-secondary mb-6 text-center">
                Frequently Asked Questions About {park.name}
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Is {park.name} free to use?
                  </h3>
                  <p className="text-gray-700">
                    {park.isFree 
                      ? `Yes, ${park.name} is completely free to use. It's a public skatepark maintained by the local community and government.` 
                      : `No, ${park.name} charges an admission fee of ${park.price}. This fee helps maintain the park and provides for staff and facilities.`}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    What features does {park.name} have?
                  </h3>
                  <p className="text-gray-700">
                    {park.name} includes {park.features.join(", ")}. It's suitable for 
                    {park.features.includes("Beginner-Friendly") ? " skaters of all skill levels, especially beginners" : " intermediate to advanced skaters"}.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    What are the best times to visit {park.name}?
                  </h3>
                  <p className="text-gray-700">
                    The best times to visit {park.name} are typically weekday mornings and early afternoons when it's less crowded. 
                    Weekends tend to be busier, especially on Saturday afternoons. The park is generally open from 9:00 AM to 9:00 PM daily,
                    but hours may vary seasonally.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    Is protective gear required at {park.name}?
                  </h3>
                  <p className="text-gray-700">
                    While helmet requirements vary by location, we always recommend wearing a helmet and protective gear
                    when skating at {park.name} or any skatepark. Safety should be your top priority when skating,
                    regardless of your skill level.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Unit at page bottom */}
          <div className="container mx-auto px-4 py-8">
            <AdUnit format="horizontal" slot="2345678901" />
          </div>
        </>
      )}
    </>
  );
};

export default ParkDetails;
