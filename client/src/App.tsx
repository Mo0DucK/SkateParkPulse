import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import FreeParks from "@/pages/free-parks";
import PaidParks from "@/pages/paid-parks";
import About from "@/pages/about";
import ParkDetails from "@/pages/park-details";
import MusicPlayer from "@/components/ui/music-player";
import { MusicPlayerProvider } from "@/contexts/music-player-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/free-parks" component={FreeParks}/>
      <Route path="/paid-parks" component={PaidParks}/>
      <Route path="/about" component={About}/>
      <Route path="/park/:id" component={ParkDetails}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicPlayerProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <MusicPlayer initialVolume={30} />
          </div>
        </TooltipProvider>
      </MusicPlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
