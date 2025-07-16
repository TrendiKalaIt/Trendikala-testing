import React from 'react';
// Importing Lucide icons for a clean visual touch.
// These icons are rendered as SVGs by Lucide React, so you don't handle SVG directly.
import {
  Sparkles,  // For quality/craftsmanship
  Users,      // For community/team
  Leaf,       // For sustainability/values
  Heart,      // For passion/customer-centricity
  Factory,    // For origin/production
  Lightbulb,  // For innovation
  Handshake   // For trust/partnership
} from 'lucide-react';


function AboutUs() { // Renamed to App as per instructions for the main component
  return (
    // Main container for the entire About Us page.
    // Uses Tailwind for background color, padding, and min-height to ensure it fills the screen.
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      {/* Hero Section: A prominent introduction to the brand. */}
      {/* Uses Tailwind for background image, overlay, text styling, and responsiveness. */}
      <section
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703075/aboutbg_hpmkai.jpg)' }}

      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white max-w-3xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair-display">
            Crafting Experiences, One Product at a Time
          </h1>
          {/* Subheading */}
          <p className="text-lg md:text-xl font-light">
            Discover the passion, purpose, and people behind TRENDIKALA.
          </p>
        </div>
      </section>

      {/* Our Story Section: Details the brand's journey and philosophy. */}
      {/* Uses Tailwind for padding, background, shadow, and responsive layout (flex/grid). */}
      <section className="container mx-auto py-16 px-4 md:px-8 bg-white rounded-xl shadow-lg mt-[-60px] relative z-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Story Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-green-700">Our Journey</h2>
            <p className="text-lg mb-4 leading-relaxed">
              Welcome to [Your E-commerce Brand], where every product tells a story. Founded in [Year] by [Founder's Name], our vision was to create more than just an online store; we aimed to build a community around quality, innovation, and exceptional service.
            </p>
            <p className="text-lg leading-relaxed">
              From our humble beginnings, meticulously sourcing the finest materials and partnering with skilled artisans, we've grown into a trusted destination for [mention your product category, e.g., unique home decor, sustainable fashion, tech gadgets]. Our commitment remains unwavering: to bring you products that not only meet your needs but also enrich your life.
            </p>
          </div>
          {/* Story Image */}
          <div className="md:w-1/2">
            <img
              src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703097/Packaging_owkvqt.jpg'
              alt="Our Brand Story"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/E5E7EB/6B7280?text=Image+Not+Found`;
              }}
            />
          </div>
        </div>
      </section>

      {/* Our Values Section: Highlights the core principles of the brand. */}
      {/* Uses Tailwind for background, padding, and a responsive grid for value items. */}
      <section className="bg-green-50 py-16 px-4 md:px-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-playfair-display text-green-700">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Value Item 1: Quality */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Sparkles size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Uncompromising Quality</h3>
              <p className="text-gray-600">
                We are dedicated to offering products crafted with superior materials and meticulous attention to detail.
              </p>
            </div>
            {/* Value Item 2: Customer Focus */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Heart size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Customer Happiness</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We strive to provide an exceptional shopping experience and support.
              </p>
            </div>
            {/* Value Item 3: Innovation */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Lightbulb size={48} className="text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Constant Innovation</h3>
              <p className="text-gray-600">
                We continuously seek new ideas and trends to bring you fresh, exciting, and relevant products.
              </p>
            </div>
            {/* Value Item 4: Sustainability (Optional, include if relevant) */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Leaf size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Conscious Sourcing</h3>
              <p className="text-gray-600">
                Committed to responsible practices, we prioritize ethical sourcing and sustainable production where possible.
              </p>
            </div>
            {/* Value Item 5: Community (Optional, include if relevant) */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Users size={48} className="text-emerald-600 mx-auto mb-4" /> {/* Changed from indigo-500 */}
              <h3 className="text-2xl font-semibold mb-3">Building Community</h3>
              <p className="text-gray-600">
                We believe in fostering connections and building a vibrant community around our shared passions.
              </p>
            </div>
            {/* Value Item 6: Transparency (Optional, include if relevant) */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Handshake size={48} className="text-teal-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We operate with integrity, ensuring clear communication and honest practices in all our dealings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      {/* Uses Tailwind for background, text, padding, and button styling. */}
      <section className="  py-16 px-4 md:px-8 text-center mt-16">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair-display">
            Ready to Explore Our Collections?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Dive into our curated selection and find something truly special.
          </p>
          <a
            href="/allproducts" 
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </a>
        </div>
      </section>

     
    </div>
  );
}

export default AboutUs;
