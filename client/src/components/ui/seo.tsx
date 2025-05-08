import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  structuredData?: Record<string, any>;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

const SEO = ({ 
  title,
  description,
  canonicalPath,
  structuredData,
  keywords = ['skateparks', 'skate spots', 'skateboarding', 'skatepark directory', 'skate locations'],
  ogImage = 'https://pixabay.com/get/g189d51ed10caead6af49c628963029f5c3522495d50bcbb8994678a1542453a0d3c11980b24681b227b0a1c802784523d6a2a5086dc1af101a68266232f17cee_1280.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'RadRamps Team',
  datePublished,
  dateModified
}: SEOProps) => {
  const [location] = useLocation();
  const fullPath = canonicalPath || location;
  const formattedTitle = `${title} | RadRamps - Find Skateparks Near You`;
  const fullUrl = `https://radramps.com${fullPath}`;

  useEffect(() => {
    // Update document title
    document.title = formattedTitle;
    
    // Find or create meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Basic SEO tags
    updateMeta('description', description);
    updateMeta('keywords', keywords.join(', '));
    updateMeta('author', author);
    
    // Open Graph Tags
    updateProperty('og:title', formattedTitle);
    updateProperty('og:description', description);
    updateProperty('og:url', fullUrl);
    updateProperty('og:type', ogType);
    updateProperty('og:image', ogImage);
    updateProperty('og:site_name', 'RadRamps');
    
    // Twitter Card Tags
    updateMeta('twitter:card', twitterCard);
    updateMeta('twitter:title', formattedTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    
    // Article specific tags
    if (ogType === 'article') {
      if (datePublished) updateProperty('article:published_time', datePublished);
      if (dateModified) updateProperty('article:modified_time', dateModified);
      updateProperty('article:author', author);
    }
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
    
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
  }, [title, description, fullPath, structuredData, keywords, ogImage, ogType, twitterCard, author, datePublished, dateModified, formattedTitle, fullUrl]);
  
  return null; // This component doesn't render anything visually
};

export default SEO;