import { Link } from "wouter";
import { type Skatepark } from "@shared/schema";
import { formatRating } from "@/lib/utils";

interface ParkCardProps {
  park: Skatepark;
  featured?: boolean;
  horizontal?: boolean;
  animationDelay?: number;
}

const ParkCard = ({ 
  park, 
  featured = false, 
  horizontal = false,
  animationDelay = 1
}: ParkCardProps) => {
  const ratingNum = parseInt(formatRating(park.rating));
  const hasHalfStar = park.rating % 10 >= 5;
  
  const stars = [];
  for (let i = 0; i < ratingNum; i++) {
    stars.push(<i key={i} className="fas fa-star text-[#ff9800]"></i>);
  }
  if (hasHalfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt text-[#ff9800]"></i>);
  }
  for (let i = stars.length; i < 5; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star text-[#ff9800]"></i>);
  }

  if (horizontal) {
    return (
      <div className={`card-tilt bg-white shadow-lg torn-edge overflow-hidden animate-drop-in animate-delay-${animationDelay}`}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            <img 
              src={park.imageUrl} 
              alt={park.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-secondary">{park.name}</h3>
              <span className={park.isFree ? "text-accent font-bold" : "text-primary font-bold"}>
                {park.isFree ? "FREE" : park.price}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
              <span>{park.city}, {park.state}</span>
            </div>
            <p className="text-gray-700 mb-4">
              {park.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {park.features.map((feature, index) => (
                <span key={index} className="bg-secondary text-white px-2 py-1 text-xs rounded">
                  {feature}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {stars}
                <span className="ml-2 text-gray-600">{formatRating(park.rating)}</span>
              </div>
              <Link 
                href={`/park/${park.id}`} 
                className="spray-btn bg-primary text-white py-2 px-4 rounded-md font-bold"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-tilt bg-white shadow-lg torn-edge overflow-hidden animate-drop-in animate-delay-${animationDelay}`}>
      <div className="relative">
        <img 
          src={park.imageUrl} 
          alt={park.name} 
          className="w-full h-64 object-cover"
        />
        {featured && (
          <div className="absolute top-0 right-0 bg-[#ff9800] text-white px-3 py-1 m-3 uppercase text-sm font-bold rounded">
            Featured
          </div>
        )}
        {park.isFeatured && !featured && (
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-3 uppercase text-sm font-bold rounded">
            Popular
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-secondary">{park.name}</h3>
          <span className={park.isFree ? "text-accent font-bold" : "text-primary font-bold"}>
            {park.isFree ? "FREE" : park.price}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
          <span>{park.city}, {park.state}</span>
        </div>
        <p className="text-gray-700 mb-4">
          {park.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {park.features.map((feature, index) => (
            <span key={index} className="bg-secondary text-white px-2 py-1 text-xs rounded">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {stars}
            <span className="ml-2 text-gray-600">{formatRating(park.rating)}</span>
          </div>
          <Link 
            href={`/park/${park.id}`} 
            className="spray-btn bg-primary text-white py-2 px-4 rounded-md font-bold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParkCard;
