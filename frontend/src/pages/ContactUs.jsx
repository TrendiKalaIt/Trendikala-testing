import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      toast.success(res.data.message || 'Message sent successfully ');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Failed to send message ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-600 text-center mb-12">
          Get in Touch
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-md rounded-xl">
          {/* Contact Form Section */}
          <div className=" p-8 ">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="your@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2 self-start">
                    <MessageSquare className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Your message..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-[#93A87E] hover:bg-[#93a87ec6] px-6 py-3 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className=" p-8 ">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600">
                    <a href="mailto:trendikalait@gmail.com" className="hover:text-green-600">
                      trendikalait@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                  <p className="text-gray-600">
                    <a href="tel:+911234567890" className="hover:text-green-600">
                      +91 123 456 7890
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Our Location</h3>
                  <p className="text-gray-600">
                    Shop No. 225, Panchsheel Square Mall,   
                    <br />
                    Crossing Republik, Ghaziabad,
                    <br />
                    Uttar Pradesh – 201016
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">9:00 AM - 9:00 PM</p>
                  {/* <p className="text-gray-600">Sat - Sun: Closed</p> */}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  <SiFacebook className="h-7 w-7" />
                </a>
                <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-red-400">
                  <SiInstagram className="h-7 w-7" />
                </a>
                <a href="https://www.youtube.com/@trendikala" target="_blank" rel="noopener noreferrer" className=" text-red-600">
                  <SiYoutube className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
