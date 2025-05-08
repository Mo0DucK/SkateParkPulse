import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { type Skatepark } from '@shared/schema';

const NearbyParks = () => {
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(25); // Default radius in km

  // Fetch nearby parks when user location is set
  const { data: nearbyParks, isLoading, refetch, isError } = useQuery<Skatepark[]>({
    queryKey: ['/api/skateparks/nearby', userLocation?.latitude, userLocation?.longitude, searchRadius],
    queryFn: () => {
      if (!userLocation) return Promise.resolve([]);
      return apiRequest(`/api/skateparks/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${searchRadius}`);
    },
    enabled: !!userLocation,
  });

  const getLocationAndFetchParks = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown error occurred");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    if (userLocation) {
      refetch();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        {!userLocation ? (
          <Card className="p-6 text-center">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <MapPin className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Find Skateparks Near You</h3>
                <p className="text-muted-foreground mb-6">
                  Discover the best places to skate in your area. We'll use your location to find skateparks nearby.
                </p>
                <Button 
                  onClick={getLocationAndFetchParks} 
                  className="flex items-center gap-2"
                  disabled={locationLoading}
                >
                  {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  {locationLoading ? "Detecting Location..." : "Find Parks Near Me"}
                </Button>
                
                {locationError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="text-sm">
                  Using your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center">
                <p className="text-sm font-medium flex items-center">Search radius:</p>
                {[10, 25, 50, 100].map((radius) => (
                  <Badge 
                    key={radius}
                    variant={searchRadius === radius ? "default" : "outline"}
                    className="cursor-pointer hover:bg-secondary/50"
                    onClick={() => handleRadiusChange(radius)}
                  >
                    {radius} km
                  </Badge>
                ))}
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Failed to load nearby skateparks. Please try again.</AlertDescription>
              </Alert>
            ) : nearbyParks && nearbyParks.length > 0 ? (
              <>
                <h3 className="font-bold text-lg mb-4">
                  Found {nearbyParks.length} skatepark{nearbyParks.length !== 1 ? 's' : ''} within {searchRadius} km
                </h3>
                <div className="space-y-4">
                  {nearbyParks.map((park) => (
                    <Link key={park.id} href={`/park/${park.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{park.name}</h4>
                              <p className="text-sm text-muted-foreground">{park.city}, {park.state}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant={park.isFree ? "default" : "secondary"} className={park.isFree ? "bg-green-500 hover:bg-green-600" : ""}>
                                  {park.isFree ? "Free" : "Paid"}
                                </Badge>
                                {park.features?.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="outline">{feature}</Badge>
                                ))}
                                {park.features && park.features.length > 3 && (
                                  <Badge variant="outline">+{park.features.length - 3} more</Badge>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {'distance' in park ? `${(park as any).distance.toFixed(1)} km` : 'Nearby'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No skateparks found within {searchRadius} km of your location. Try increasing the search radius.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={getLocationAndFetchParks} size="sm">
                <Loader2 className="h-4 w-4 mr-2" />
                Refresh location
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NearbyParks;