import React from 'react';

import {
  Sparkles,
  Users,
  Leaf,
  Heart,
  Factory,
  Lightbulb,
  Handshake
} from 'lucide-react';


function AboutUs() {
  return (

    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">

      <section
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url()' }} >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-8 text-white max-w-3xl mx-auto">
          <h1 className=" font-home text-4xl md:text-6xl font-bold mb-4 font-playfair-display">
            Crafting Experiences, One Product at a Time
          </h1>
          <p className="font-body text-lg md:text-xl font-light">
            Discover the passion, purpose, and people behind TRENDIKALA.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4 md:px-8 bg-white rounded-xl shadow-lg mt-[-60px] relative z-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 font-playfair-display text-green-700">Our Journey</h2>
            <p className="font-body text-lg mb-4 leading-relaxed ">
              We’re two friends who turned our shared dream into reality. ✨
              One of us is a designer with an eye for detail and timeless style, while the other comes from a journalism & marketing background, passionate about storytelling and connecting with people. Together, we decided to create more than just a clothing brand — we wanted to build a space where fashion feels personal, aesthetic, and accessible.
              At Trendikala, we believe that great style doesn’t have to come with a hefty price tag. Our vision is to bring you Pinterest-inspired vibes with the best quality fabrics, unique designs, and a touch of craftsmanship — all at prices that feel good.
              Every piece is thoughtfully designed, carefully produced, and made with love, because we don’t just want to sell clothes, we want you to feel confident, comfortable, and effortlessly stylish every day.
              From custom pieces to everyday outfits, we are here to make your wardrobe truly you. 💌
              ✨ Two friends. One dream. Your story, in style.
            </p>
           
          </div>
          <div className="md:w-1/2">
            <img
              src=''
              alt="Our Brand Story"
              className="rounded-lg shadow-xl w-full h-auto lg:h-[400px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/E5E7EB/6B7280?text=Image+Not+Found`;
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-green-50 py-16 px-4 md:px-8 mt-16">
        <div className="container mx-auto text-center">
          <h2 className=" font-heading text-3xl md:text-4xl font-bold mb-12 font-playfair-display text-green-700">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Value Item 1: Quality */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Sparkles size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className=" font-heading text-2xl font-semibold mb-3">Uncompromising Quality</h3>
              <p className="font-body text-gray-600">
                We are dedicated to offering products crafted with superior materials and meticulous attention to detail.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Heart size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className=" font-heading text-2xl font-semibold mb-3">Customer Happiness</h3>
              <p className="font-body text-gray-600">
                Your satisfaction is our priority. We strive to provide an exceptional shopping experience and support.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Lightbulb size={48} className="text-blue-500 mx-auto mb-4" />
              <h3 className=" font-heading text-2xl font-semibold mb-3">Constant Innovation</h3>
              <p className="font-body text-gray-600">
                We continuously seek new ideas and trends to bring you fresh, exciting, and relevant products.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Leaf size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className=" font-heading text-2xl font-semibold mb-3">Conscious Sourcing</h3>
              <p className="font-body text-gray-600">
                Committed to responsible practices, we prioritize ethical sourcing and sustainable production where possible.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Users size={48} className="text-emerald-600 mx-auto mb-4" /> {/* Changed from indigo-500 */}
              <h3 className=" font-heading text-2xl font-semibold mb-3">Building Community</h3>
              <p className="font-body text-gray-600">
                We believe in fostering connections and building a vibrant community around our shared passions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Handshake size={48} className="text-teal-500 mx-auto mb-4" />
              <h3 className=" font-heading text-2xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="font-body text-gray-600">
                We operate with integrity, ensuring clear communication and honest practices in all our dealings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="  py-16 px-4 md:px-8 text-center mt-16">
        <div className="container mx-auto">
          <h2 className=" font-heading text-3xl md:text-4xl font-bold mb-6 font-playfair-display">
            Ready to Explore Our Collections?
          </h2>
          <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Dive into our curated selection and find something truly special.
          </p>
          <a
            href="/allproducts"
            className="font-heading inline-block bg-white text-green-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </a>
        </div>
      </section>


    </div>
  );
}

export default AboutUs;
