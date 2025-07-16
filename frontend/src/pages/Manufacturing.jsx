
import React from 'react';
// Importing Lucide icons relevant to manufacturing, quality, and ethics.
import {
  Factory,        // Represents the manufacturing facility
  Settings,       // For machinery, precision, or process
  CheckCircle,    // For quality control and assurance
  Leaf,           // For sustainability and eco-friendly practices
  Users,          // For the team, artisans, or ethical labor
  Package,        // For raw materials or finished products
  Sparkles,       // For craftsmanship or attention to detail
  Palette,        // For design/creativity
  Truck           // For logistics/delivery
} from 'lucide-react';

/**
 * ManufacturingPage Component
 * This component designs an alternative, more visual page to showcase the manufacturing process
 * of an e-commerce brand. It emphasizes a step-by-step journey, quality, transparency,
 * and ethical practices, styled with Tailwind CSS and Lucide icons.
 */
function Manufacturing() { // Renamed to App as per instructions for the main component
  return (
    // Main container for the entire Manufacturing Page.
    // Uses a light gray background and ensures it takes at least the full screen height.
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      {/* Hero Section: Introduces the manufacturing philosophy. */}
      <section
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703254/Manufacturingbg_yrfope.jpg)' }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair-display">
            Where Quality Meets Craftsmanship
          </h1>
          <p className="text-lg md:text-xl font-light">
            A transparent look into the meticulous process behind every TRENDI KALA we create.
          </p>
        </div>
      </section>

      {/* Introduction to Manufacturing Philosophy */}
      <section className="container mx-auto py-16 px-4 md:px-8 bg-white rounded-xl shadow-lg mt-[-60px] relative z-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-green-700">
          Our Philosophy: Built to Last
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          At [Your E-commerce Brand], we believe that true quality is woven into every fiber and forged in every process. Our manufacturing journey is driven by a commitment to excellence, sustainability, and the well-being of our artisans. We invite you to explore the steps that bring our products to life.
        </p>
      </section>

      {/* Manufacturing Process Section: Stepped/Timeline Layout */}
      <section className="container mx-auto py-16 px-4 md:px-8 mt-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-playfair-display text-green-700">
          The Journey of Creation
        </h2>
        <div className="relative flex flex-col items-center">
          {/* Vertical line for the timeline effect */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-200 h-full hidden md:block"></div>

          {/* Process Step 1 */}
          <div className="flex flex-col md:flex-row items-center w-full mb-12 md:mb-16">
            <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 relative">
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md md:ml-8 mt-4 md:mt-0 md:text-right">
                <Palette size={40} className="text-green-500 mb-3 mx-auto md:ml-auto md:mr-0" />
                <h3 className="text-2xl font-semibold mb-2">Concept & Design</h3>
                <p className="text-gray-600">
                  It all begins with an idea. Our designers meticulously sketch, refine, and plan each product, focusing on aesthetics, functionality, and durability.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start md:pl-12">
              <img
                src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703275/team_zlywmg.jpg'
                alt="Design Process"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-md h-auto object-cover mt-4 md:mt-0"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E5E7EB/6B7280?text=Image+Not+Found`; }}
              />
            </div>
          </div>

          {/* Process Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center w-full mb-12 md:mb-16">
            <div className="md:w-1/2 flex justify-center md:justify-end md:pl-12 relative">
              
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md md:mr-8 mt-4 md:mt-0 md:text-left">
                <Package size={40} className="text-green-500 mb-3 mx-auto md:mr-auto md:ml-0" />
                <h3 className="text-2xl font-semibold mb-2">Material Sourcing</h3>
                <p className="text-gray-600">
                  We carefully select premium, ethically sourced materials, ensuring both the quality of our products and our commitment to the planet.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start md:pr-12">
              <img
                src= 'https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703267/Quality_trvm0l.jpg'
                alt="Material Sourcing"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-md h-auto object-cover mt-4 md:mt-0"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E5E7EB/6B7280?text=Image+Not+Found`; }}
              />
            </div>
          </div>

          {/* Process Step 3 */}
          <div className="flex flex-col md:flex-row items-center w-full mb-12 md:mb-16">
            <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 relative">
              
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md md:ml-8 mt-4 md:mt-0 md:text-right">
                <Settings size={40} className="text-green-500 mb-3 mx-auto md:ml-auto md:mr-0" />
                <h3 className="text-2xl font-semibold mb-2">Precision Manufacturing</h3>
                <p className="text-gray-600">
                  Our state-of-the-art facilities and skilled artisans transform raw materials into finished products with unparalleled precision.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start md:pl-12">
              <img
                src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703230/Manufacturing_ywczmy.jpg'
                alt="Manufacturing Process"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-md h-auto object-cover mt-4 md:mt-0"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E5E7EB/6B7280?text=Image+Not+Found`; }}

              />
            </div>
          </div>

          {/* Process Step 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center w-full mb-12 md:mb-16">
            <div className="md:w-1/2 flex justify-center md:justify-end md:pl-12 relative">
             
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md md:mr-8 mt-4 md:mt-0 md:text-left">
                <CheckCircle size={40} className="text-green-500 mb-3 mx-auto md:mr-auto md:ml-0" />
                <h3 className="text-2xl font-semibold mb-2">Rigorous Quality Control</h3>
                <p className="text-gray-600">
                  Every single item undergoes multiple layers of strict quality checks to ensure it meets our high standards before it reaches you.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start md:pr-12">
              <img
                src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703267/Quality_trvm0l.jpg'
                alt="Quality Control"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-md h-auto object-cover mt-4 md:mt-0"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E5E7EB/6B7280?text=Image+Not+Found`; }}
              />
            </div>
          </div>

          {/* Process Step 5 */}
          <div className="flex flex-col md:flex-row items-center w-full">
            <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 relative">
              
              <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md md:ml-8 mt-4 md:mt-0 md:text-right">
                <Truck size={40} className="text-green-500 mb-3 mx-auto md:ml-auto md:mr-0" />
                <h3 className="text-2xl font-semibold mb-2">Packaging & Dispatch</h3>
                <p className="text-gray-600">
                  Products are carefully packaged to ensure safe delivery and dispatched to their new homes.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-start md:pl-12">
              <img
                src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703255/Packaging_jpjmrf.jpg'
                alt="Packaging and Dispatch"
                className="rounded-lg shadow-md w-full max-w-xs md:max-w-md h-auto object-cover mt-4 md:mt-0"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/E5E7EB/6B7280?text=Image+Not+Found`; }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Our Commitment Section (Quality & Sustainability) */}
      <section className="bg-green-50 py-16 px-4 md:px-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-playfair-display text-green-700">
            Our Unwavering Commitment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Commitment 1: Quality */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CheckCircle size={60} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Superior Quality</h3>
              <p className="text-gray-600">
                We use only the finest materials and employ rigorous quality checks at every stage to ensure durability and excellence.
              </p>
            </div>
            {/* Commitment 2: Sustainability */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Leaf size={60} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Sustainable Practices</h3>
              <p className="text-gray-600">
                From eco-friendly materials to responsible waste management, we strive for a minimal environmental footprint.
              </p>
            </div>
            {/* Commitment 3: Ethical Labor */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Users size={60} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Ethical Production</h3>
              <p className="text-gray-600">
                We ensure fair wages, safe working conditions, and respect for all individuals involved in our production process.
              </p>
            </div>
            {/* Commitment 4: Innovation */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Sparkles size={60} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Continuous Improvement</h3>
              <p className="text-gray-600">
                We are always seeking new technologies and methods to enhance our products and processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Craft / Meet the Team Section (Optional) */}
      <section className="container mx-auto py-16 px-4 md:px-8 mt-16">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          {/* Team Image */}
          <div className="md:w-1/2">
            <img
              src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752703221/design_rrckzg.jpg'
              alt="Our Dedicated Team"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/E5E7EB/6B7280?text=Image+Not+Found`;
              }}
            />
          </div>
          {/* Team Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-green-700">
              Behind the Craft: Our Dedicated Team
            </h2>
            <p className="text-lg mb-4 leading-relaxed">
              Our products are brought to life by a team of passionate artisans and skilled professionals. Their expertise, dedication, and attention to detail are the heart of our manufacturing process. We celebrate their craftsmanship and the human touch in every item.
            </p>
            <p className="text-lg leading-relaxed">
              They are not just employees; they are the creators who ensure the quality and integrity of everything we offer.
            </p>
          </div>
        </div>
      </section>




    </div>
  );
}

export default Manufacturing;

