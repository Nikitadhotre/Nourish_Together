import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaHandsHelping,
  FaUsers,
  FaUserPlus,
  FaLink,
  FaCog,
  FaChartLine,
  FaExclamationTriangle,
  FaRecycle,
  FaMoneyBillWave,
  FaLeaf,
  FaGlobe,
  FaHeart,
  FaArrowRight,
  FaUser,
  FaGift,
  FaBuilding,
  FaTruck,
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const ContactUs = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-' + entry.target.dataset.animate);
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white w-full">
      {/* Contact Information Section */}
      <section className="py-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Get In Touch</h2>
          <div className="decorative-line"></div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up">
              <FaMapMarkerAlt className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-600">
                123 Food Street<br />
                Hunger-Free City, HF 12345<br />
                United States
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-300">
              <FaPhone className="text-4xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">
                +1 (123) 456-7890<br />
                Mon-Fri: 9AM - 6PM<br />
                Sat-Sun: 10AM - 4PM
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-600">
              <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">
                info@nourishtogether.org<br />
                support@nourishtogether.org<br />
                partnerships@nourishtogether.org
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Send Us a Message</h2>
          <div className="decorative-line"></div>
          <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 animate-bounce"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <div className="decorative-line"></div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
              <h3 className="text-xl font-semibold mb-4">How can I become a donor?</h3>
              <p className="text-gray-600">
                Simply register on our platform as a donor. You can then list food donations or make monetary contributions to support our cause.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up animation-delay-300">
              <h3 className="text-xl font-semibold mb-4">How do I join as a volunteer?</h3>
              <p className="text-gray-600">
                Register as a volunteer on our website. We'll match you with opportunities to help collect and deliver food in your area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up animation-delay-600">
              <h3 className="text-xl font-semibold mb-4">How can NGOs partner with us?</h3>
              <p className="text-gray-600">
                NGOs can register on our platform to access donations and coordinate distribution. Contact us for partnership details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up animation-delay-900">
              <h3 className="text-xl font-semibold mb-4">Is my donation tax-deductible?</h3>
              <p className="text-gray-600">
                Yes, monetary donations to Nourish Together are tax-deductible. Food donations help reduce waste and support communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-0">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join our community of donors, volunteers, and NGOs working together to fight hunger.
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 animate-bounce"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nourish Together</h3>
              <p className="text-gray-300">
                Connecting food donors with NGOs and volunteers to fight hunger
                and reduce food waste.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className="text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-white"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">Email: info@nourishtogether.org</p>
              <p className="text-gray-300">Phone: +1 (123) 456-7890</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8">
            <p className="text-gray-300 text-center">
              © 2023 Nourish Together. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
