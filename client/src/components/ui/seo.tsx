import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  structuredData?: Record<string, any>;
}

const SEO = ({ title, description, canonicalPath, structuredData }: SEOProps) => {
  const [location] = useLocation();
  const fullPath = canonicalPath || location;

  useEffect(() => {
    // Update document title
    document.title = title + ' | RadRamps';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://radramps.com${fullPath}`);
    }
    
    // Add structured data
    if (structuredData) {
      // Check for existing script tag
      let script = document.querySelector('#structured-data');
      
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      } else {
        // Create new script element
        script = document.createElement('script');
        script.id = 'structured-data';
        script.setAttribute('type', 'application/ld+json');
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
    
    return () => {
      // Clean up structured data when component unmounts
      if (structuredData) {
        const script = document.querySelector('#structured-data');
        if (script) {
          script.remove();
        }
      }
    };
  }, [title, description, fullPath, structuredData]);
  
  return null; // This component doesn't render anything visually
};

export default SEO;