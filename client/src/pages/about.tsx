import { SkateDivider } from "@/components/ui/skate-divider";
import SEO from "@/components/ui/seo";
import AdUnit from "@/components/ui/ad-unit";

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-secondary py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading text-white text-center mb-4">
            ABOUT <span className="text-primary">US</span>
          </h1>
          <SkateDivider className="max-w-md mx-auto my-6" />
          <p className="text-lg text-white text-center max-w-3xl mx-auto">
            The story behind RadRamps and our mission to map every awesome skatepark in America.
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://pixabay.com/get/g2118497a6ab4c573b1c6839b725e6f852e44a0c9b0be78f0ff891f7d24453dbc4d1e72d36768cdd07506994e2858fab981ec340771c2897ccd6b0cfefed97a22_1280.jpg" 
                alt="Young skateboarder sitting on a ramp" 
                className="w-full h-auto object-cover rounded-lg shadow-lg torn-edge"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-marker text-primary mb-4">Our Story</h3>
              <p className="text-gray-700 mb-4">
                RadRamps started with a simple problem: I couldn't find a decent place to skate. 
              </p>
              <p className="text-gray-700 mb-4">
                I'm Jake, and I got my first board when I was 12. Living in a small town in the Midwest, finding good spots was nearly impossible. I'd spend hours on forums trying to find skate spots whenever my family traveled.
              </p>
              <p className="text-gray-700 mb-4">
                After too many wasted trips to "skateparks" that turned out to be a single rusty rail in an abandoned parking lot, I decided to solve the problem myself. During a coding bootcamp in 2019, I built the first version of RadRamps as my final project.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a personal database has grown into the most comprehensive guide to skateparks across America. Our community of skaters contributes reviews, photos, and tips daily, helping everyone from beginners to pros find their perfect spot to shred.
              </p>
              <p className="text-gray-700">
                Whether you're looking for a mellow park to learn your first ollie or a pro-level bowl to push your limits, we've got you covered. Skating changed my life, and I hope RadRamps helps you discover new places to progress and connect with the skateboarding community.
              </p>
              
              <div className="mt-8">
                <p className="font-marker text-xl text-primary">"Keep pushing, stay rad."</p>
                <p className="text-gray-700">- Jake, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 bg-neutral">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading text-secondary uppercase text-center mb-8">Our Mission</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg torn-edge">
              <p className="text-lg mb-4">
                RadRamps exists to connect skaters with the best parks across the United States through:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center">
                  <div className="text-primary text-3xl mb-3">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Comprehensive Mapping</h3>
                  <p>Documenting every quality skatepark in America with accurate details</p>
                </div>
                
                <div className="text-center">
                  <div className="text-primary text-3xl mb-3">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Community Building</h3>
                  <p>Creating connections between skaters and fostering local skate scenes</p>
                </div>
                
                <div className="text-center">
                  <div className="text-primary text-3xl mb-3">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Accessibility</h3>
                  <p>Making skateboarding more accessible by highlighting free options</p>
                </div>
              </div>
              
              <p className="text-lg mb-4">
                We believe skateboarding is for everyone. By providing reliable information about parks across the country, we hope to make it easier for people to discover the joy of skateboarding, regardless of their location or budget.
              </p>
              
              <p className="text-lg">
                Our ultimate goal is to foster a nationwide skating community that supports each other, advocates for more skateparks, and helps the culture thrive for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading text-secondary uppercase text-center mb-10">The Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-neutral p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://pixabay.com/get/g1a5af9abcf8f42bffccc5c07cda99ae9ed04c61bc70c22bbfdf12a82b1c6c66f9b6fe60aa41f6ab5a9a0ae40a59f7a68e39ed5c7c93b02d44c8e37c1ea580f92_1280.jpg" 
                  alt="Jake - Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Jake</h3>
              <p className="text-primary font-marker mb-3">Founder</p>
              <p className="text-gray-700">
                Skater since age 12, web developer, and park database obsessive.
              </p>
            </div>

            <div className="bg-neutral p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://pixabay.com/get/ga3d1a8f8bf0a6fc22d0e92b8ef1fd5e17b95c2c3d9ff8d3f8c7dba61f4a01c7dd6bf3e93051d42f7c1ace3e8a2c06dc2_1280.jpg" 
                  alt="Sarah - Content Manager" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Sarah</h3>
              <p className="text-primary font-marker mb-3">Content Manager</p>
              <p className="text-gray-700">
                Former pro skater with an eye for detail and photography skills.
              </p>
            </div>

            <div className="bg-neutral p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img 
                  src="https://pixabay.com/get/gd428fba9c3de9acdb93f90cf3f9a03b51d24c5daf3e04b1bc8c686cb3ab21626e2c62a47cba6e25abfb1b8eeff2c63ebcfb2a6a5ae3ba4b7dd12e4ba3b58af36_1280.jpg" 
                  alt="Miguel - Community Lead" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Miguel</h3>
              <p className="text-primary font-marker mb-3">Community Lead</p>
              <p className="text-gray-700">
                Skatepark advocate and organizer connecting skaters nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading text-white uppercase mb-6">Get In Touch</h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a 
              href="mailto:info@radramps.com" 
              className="spray-btn bg-primary text-white py-3 px-8 rounded-md font-bold text-lg"
            >
              <i className="fas fa-envelope mr-2"></i> Email Us
            </a>
            <a 
              href="#" 
              className="spray-btn bg-accent text-white py-3 px-8 rounded-md font-bold text-lg"
            >
              <i className="fas fa-comments mr-2"></i> Community Forum
            </a>
          </div>
          
          <p className="text-white font-marker text-xl">
            "Stay rad, keep rolling!"
          </p>
        </div>
      </section>
    </>
  );
};

export default About;
