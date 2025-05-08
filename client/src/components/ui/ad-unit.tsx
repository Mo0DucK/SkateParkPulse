import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  className?: string;
  format?: "horizontal" | "vertical" | "square" | "responsive" | "in-article" | "in-feed";
  slot?: string;
  adTest?: boolean;
  lazyLoad?: boolean;
}

const AdUnit = ({ 
  className, 
  format = "horizontal", 
  slot = "0000000000", 
  adTest = false,
  lazyLoad = true
}: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adId] = useState(`ad-${Math.random().toString(36).substring(2, 11)}`);
  
  useEffect(() => {
    // Function to load ads
    const loadAd = () => {
      try {
        if (!window.adsbygoogle) {
          console.warn('AdSense not loaded yet');
          return;
        }
        
        const adElement = document.getElementById(adId)?.querySelector('.adsbygoogle');
        if (!adElement) return;
        
        if (!adElement.getAttribute('data-adsbygoogle-status')) {
          console.log(`Loading ad in slot ${slot}`);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (e) {
        console.error("Error loading AdSense ad:", e);
      }
    };
    
    // Function to check if ad is in viewport (for lazy loading)
    const isInViewport = (element: HTMLDivElement) => {
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 400 && // 400px buffer
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    
    // Observer for lazy loading
    if (lazyLoad && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !adLoaded) {
              loadAd();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      if (adRef.current) {
        observer.observe(adRef.current);
      }
      
      return () => {
        if (adRef.current) {
          observer.unobserve(adRef.current);
        }
      };
    } else {
      // Fallback for browsers without IntersectionObserver or when lazy loading is disabled
      const handleScroll = () => {
        if (adRef.current && isInViewport(adRef.current) && !adLoaded) {
          loadAd();
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      // Load ad immediately if visible
      if (adRef.current && isInViewport(adRef.current)) {
        loadAd();
      } else {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [adId, adLoaded, lazyLoad, slot]);
  
  // Define ad sizes based on format
  const getAdStyle = () => {
    switch (format) {
      case "horizontal":
        return { minHeight: "90px", width: "100%" };
      case "vertical":
        return { minHeight: "600px", width: "300px" };
      case "square":
        return { minHeight: "250px", width: "300px" };
      case "in-article":
        return { minHeight: "250px", width: "100%" };
      case "in-feed":
        return { minHeight: "250px", width: "100%" };
      case "responsive":
      default:
        return { minHeight: "100px", width: "100%" };
    }
  };
  
  // Get ad format attribute based on format prop
  const getAdFormat = () => {
    switch (format) {
      case "in-article":
        return "fluid";
      case "in-feed":
        return "fluid";
      default:
        return "auto";
    }
  };
  
  return (
    <div id={adId} ref={adRef} className={cn("my-4 overflow-hidden bg-neutral shadow-md rounded-md", className)}>
      <div className="text-xs text-center text-gray-500 py-1 bg-gray-100">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...getAdStyle() }}
        data-ad-client="ca-pub-5216051217858954"
        data-ad-slot={slot}
        data-ad-format={getAdFormat()}
        data-full-width-responsive="true"
        data-adtest={adTest ? "on" : "off"}
      />
    </div>
  );
};

export default AdUnit;