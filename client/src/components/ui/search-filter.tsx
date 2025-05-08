import { useState } from "react";
import { STATES, PARK_FEATURES } from "@/lib/utils";

interface SearchFilterProps {
  onSearch: (query: string, state: string, parkType: string) => void;
}

const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedType, setSelectedType] = useState("All Types");

  const handleSearch = () => {
    onSearch(searchQuery, selectedState, selectedType);
  };

  return (
    <div className="bg-secondary py-6 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <input 
              type="text" 
              placeholder="Search skateparks..." 
              className="w-full py-3 px-4 pr-10 bg-neutral rounded-md text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary"
              onClick={handleSearch}
              aria-label="Search"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select 
              className="bg-neutral py-2 px-4 rounded-md text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <select 
              className="bg-neutral py-2 px-4 rounded-md text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {PARK_FEATURES.map((feature) => (
                <option key={feature} value={feature}>{feature}</option>
              ))}
            </select>
            
            <button 
              className="spray-btn bg-accent text-white py-2 px-6 rounded-md font-bold"
              onClick={handleSearch}
            >
              <i className="fas fa-filter mr-2"></i> Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
