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
} from "react-icons/fa";

const AboutUs = () => {
  const { user } = useAuth();
  const [mealsServed, setMealsServed] = useState(0);
  const [ngosConnected, setNgosConnected] = useState(0);
  const [volunteers, setVolunteers] = useState(0);
  const [fundsRaised, setFundsRaised] = useState(0);

  const getDashboardLink = () => {
    if (user?.role === "donor") return "/donor-dashboard";
    if (user?.role === "ngo") return "/ngo-dashboard";
    if (user?.role === "volunteer") return "/volunteer-dashboard";
    if (user?.role === "admin") return "/admin-dashboard";
    return "/";
  };

  useEffect(() => {
    const animateCounter = (target, setter, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16); // 60fps
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    // Start animations with delays
    setTimeout(() => animateCounter(10000, setMealsServed), 500);
    setTimeout(() => animateCounter(500, setNgosConnected), 700);
    setTimeout(() => animateCounter(2000, setVolunteers), 900);
    setTimeout(() => animateCounter(50000, setFundsRaised), 1100);
  }, []);

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
      {/* Our Story Section */}
      <section className="pt-12 pb-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Our Story</h2>
          <div className="decorative-line"></div>
          <div className="bg-white p-10 pt-15 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center animate-slide-in-left">
                <img
                  src="src/assets/HPimg2.jpeg"
                  alt="Our Story Illustration"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
              <div className="animate-slide-in-right">
                <p className="text-lg text-gray-700">
                  Nourish Together was founded with a simple yet powerful vision: to eliminate hunger by bridging the gap between surplus food and those in need. Our founders recognized that while millions suffer from food insecurity, tons of edible food are wasted daily. By creating a platform that connects donors, NGOs, and volunteers, we aim to create a sustainable solution to this global issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Our Mission</h2>
          <div className="decorative-line"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up">
              <FaUtensils className="text-4xl text-green-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Connect Donors</h3>
              <p className="text-gray-600">
                Empower food donors to share surplus food easily through our platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-300">
              <FaHandsHelping className="text-4xl text-orange-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Support NGOs</h3>
              <p className="text-gray-600">
                Provide NGOs with efficient tools to coordinate and distribute donations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-4000">
              <FaUsers className="text-4xl text-blue-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Engage Volunteers</h3>
              <p className="text-gray-600">
                Mobilize volunteers to help in collection and delivery processes.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Call To Action Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-0">Join Our Mission</h2>
          <p className="text-xl mb-8">
            Be part of the change. Start donating or volunteering today.
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 animate-bounce"
          >
            Get Started
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

export default AboutUs;
