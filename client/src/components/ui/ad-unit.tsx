import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  className?: string;
  format?: "horizontal" | "vertical" | "square";
  slot?: string;
}

const AdUnit = ({ className, format = "horizontal", slot = "0000000000" }: AdUnitProps) => {
  useEffect(() => {
    // Load ad when component mounts
    try {
      const adElements = document.querySelectorAll('.adsbygoogle');
      if (window.adsbygoogle && adElements.length > 0) {
        for (let i = 0; i < adElements.length; i++) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.error("Error loading AdSense ad:", e);
    }
  }, []);
  
  // Define ad sizes based on format
  const getAdStyle = () => {
    switch (format) {
      case "horizontal":
        return { minHeight: "90px", width: "100%" };
      case "vertical":
        return { minHeight: "600px", width: "300px" };
      case "square":
        return { minHeight: "250px", width: "300px" };
      default:
        return { minHeight: "90px", width: "100%" };
    }
  };
  
  return (
    <div className={cn("my-4 overflow-hidden bg-neutral shadow-md rounded-md", className)}>
      <div className="text-xs text-center text-gray-500 py-1 bg-gray-100">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...getAdStyle() }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdUnit;