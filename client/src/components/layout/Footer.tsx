import { Link } from "wouter";
import { SkateDivider } from "@/components/ui/skate-divider";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-primary font-heading text-xl mb-4">
              RAD<span className="text-accent">RAMPS</span>
            </h3>
            <p className="text-gray-400 mb-4">
              The ultimate guide to skateparks across the United States. Find your perfect place to skate.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="YouTube">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="TikTok">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/free-parks" className="text-gray-400 hover:text-primary transition-colors">
                  Free Parks
                </Link>
              </li>
              <li>
                <Link href="/paid-parks" className="text-gray-400 hover:text-primary transition-colors">
                  Paid Parks
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Beginner's Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Skate Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Park Rules
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Directory
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2 text-primary"></i>
                <span className="text-gray-400">info@radramps.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-primary"></i>
                <span className="text-gray-400">Portland, OR</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-headset mt-1 mr-2 text-primary"></i>
                <span className="text-gray-400">Support: help@radramps.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <SkateDivider className="my-6" />
        
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RadRamps. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
