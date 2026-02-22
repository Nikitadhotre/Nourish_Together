import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
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
import HeroImage from "../assets/Hero.png";
import SDG1Image from "../assets/SDG1.jpg";
import SDG2Image from "../assets/SDG2.jpg";
import SDG3Image from "../assets/SGD3.jpg";
import SDG12Image from "../assets/SDG12.jpg";
import SDG13Image from "../assets/SDG13.jpg";
import StepsImage from "../assets/steps.png";

const Home = () => {
  const { user } = useAuth();
  const [mealsServed, setMealsServed] = useState(0);
  const [ngosConnected, setNgosConnected] = useState(0);
  const [volunteers, setVolunteers] = useState(0);
  const [fundsRaised, setFundsRaised] = useState(0);
  const impactRef = useRef(null);

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

    const startAnimations = () => {
      animateCounter(10000, setMealsServed);
      setTimeout(() => animateCounter(500, setNgosConnected), 200);
      setTimeout(() => animateCounter(2000, setVolunteers), 400);
      setTimeout(() => animateCounter(50000, setFundsRaised), 600);
    };

    // Check if section is already in view on mount
    if (impactRef.current) {
      const rect = impactRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startAnimations();
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimations();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (impactRef.current) {
      observer.observe(impactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-white w-full">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6">
        <section
          className="relative text-white pt-8 pb-20 mt-10 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${HeroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          data-aos="fade-up"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative w-full px-4 text-center">
            <h1 className="text-5xl font-bold mb-4 mt-24" data-aos="fade-up">
              No One Should Sleep Hungry
            </h1>

            <p className="text-xl mb-8 max-w-2xl mt-14 mx-auto" data-aos="fade-up" data-aos-delay="300">
              Our mission is to connect food donors with NGOs and volunteers to
              fight hunger and reduce food waste.
            </p>

            <div className="space-x-4" data-aos="fade-up" data-aos-delay="600">
              <Link
                to={user ? "/donor-dashboard" : "/login?redirect=donor-dashboard"}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Donate Food
              </Link>

              <Link
                to={user ? "/payment" : "/login?redirect=payment"}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
              >
                Donate Money
              </Link>
            </div>
          </div>
        </section>
      </div>



      {/* Problem Statement Section */}
      <section className="pt-12 pb-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">

          <div className="bg-white p-10 pt-15 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center" data-aos="fade-right">
                <img
                  src="src/assets/HPimg2.jpeg"
                  alt="Problem Illustration"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
              <div data-aos="fade-left" data-aos-delay="200">
                <p className="text-lg text-gray-700">
                  <h2 className="text-3xl text-black font-bold text-left mb-4 ">The Growing Imbalance Between Surplus and Scarcity</h2>

                  Every day, millions go hungry while large amounts of edible food are wasted. This imbalance isn’t caused by food shortages, but by gaps in distribution and coordination. Surplus food from restaurants, events, and households is discarded while vulnerable communities suffer. Without an efficient redistribution system, we waste resources, harm the environment, and fail those who need support most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effects of Hunger Section */}
      <section className="py-2 w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            The Social and Environmental Impact
          </h2>
          <div className="decorative-line mt-20 mb-10"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Malnutrition</h3>
              <p className="text-gray-600">
                Lack of proper nutrition leads to health issues and
                developmental problems.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaRecycle className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Food Waste</h3>
              <p className="text-gray-600">
                Billions of tons of food are wasted annually, contributing to
                environmental issues.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaMoneyBillWave className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Poverty Cycle</h3>
              <p className="text-gray-600">
                Hunger perpetuates poverty, making it harder for communities to
                thrive.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaLeaf className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Environmental Damage
              </h3>
              <p className="text-gray-600">
                Food waste contributes to greenhouse gas emissions and resource
                depletion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 pb-16 bg-white w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">How We Make a Difference</h2>
          <div className="decorative-line mt-20 mb-10"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up">
              <FaUtensils className="text-4xl text-green-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Connect Donors</h3>
              <p className="text-gray-600">
                Food donors can easily share surplus food through our platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-300">
              <FaHandsHelping className="text-4xl text-orange-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Empower NGOs</h3>
              <p className="text-gray-600">
                NGOs can access donations and coordinate distribution
                efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up animation-delay-4000">
              <FaUsers className="text-4xl text-blue-500 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Engage Volunteers</h3>
              <p className="text-gray-600">
                Volunteers help in collecting and delivering food to those in
                need.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* <section className="py-20 w-full bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-2">
            How Nourish Together Works
          </h2>
          <div className="decorative-line"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-12 text-center">

            
            <div className="relative">
              <span className="absolute -top-6 left-1/4 -translate-x-1/2 text-8xl font-bold text-gray-500 z-20">
                1
              </span>
              <div className="relative z-10 flex flex-col items-center bg-blue-200 p-6 rounded-lg shadow-lg transform rotate-1 mt-8" style={{ transformOrigin: 'top center' }}>
                <FaUser className="text-5xl text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Register</h3>
                <p className="text-gray-600 text-sm">
                  Create your account as a donor, NGO, or volunteer.
                </p>
              </div>
            </div>

           
            <div className="relative">
              <span className="absolute -top-6 left-1/4 -translate-x-1/2 text-8xl font-bold text-gray-500 z-20">
                2
              </span>
              <div className="relative z-10 flex flex-col items-center bg-green-200 p-6 rounded-lg shadow-lg transform -rotate-1 mt-8" style={{ transformOrigin: 'top center' }}>
                <FaGift className="text-5xl text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Submit Donation</h3>
                <p className="text-gray-600 text-sm">
                  Donors list available food or funds.
                </p>
              </div>
            </div>

         
            <div className="relative">
              <span className="absolute -top-6 left-1/4 -translate-x-1/2 text-8xl font-bold text-gray-500 z-20">
                3
              </span>
              <div className="relative z-10 flex flex-col items-center bg-purple-200 p-6 rounded-lg shadow-lg transform rotate-2 mt-8" style={{ transformOrigin: 'top center' }}>
                <FaBuilding className="text-5xl text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">NGO Accepts</h3>
                <p className="text-gray-600 text-sm">
                  NGOs review and confirm donations.
                </p>
              </div>
            </div>

          
            <div className="relative">
              <span className="absolute -top-6 left-1/4 -translate-x-1/2 text-8xl font-bold text-gray-500 z-20">
                4
              </span>
              <div className="relative z-10 flex flex-col items-center bg-orange-200 p-6 rounded-lg shadow-lg transform -rotate-2 mt-8" style={{ transformOrigin: 'top center' }}>
                <FaTruck className="text-5xl text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Volunteer Collects</h3>
                <p className="text-gray-600 text-sm">
                  Volunteers pick up and deliver food.
                </p>
              </div>
            </div>

           
            <div className="relative">
              <span className="absolute -top-6 left-1/4 -translate-x-1/2 text-8xl font-bold text-gray-500 z-20">
                5
              </span>
              <div className="relative z-10 flex flex-col items-center bg-red-200 p-6 rounded-lg shadow-lg transform rotate-1 mt-8" style={{ transformOrigin: 'top center' }}>
                <FaCheck className="text-5xl text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Food Delivered</h3>
                <p className="text-gray-600 text-sm">
                  Meals reach those in need.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section> */}

      <section className="py-7 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-2">
            How Nourish Together Works
          </h2>
          <div className="decorative-line mt-20 mb-10"></div>

          <div className="flex justify-center items-center mt-12">
            <img
              src={StepsImage}
              alt="How Nourish Together Works"
              className="w-full max-w-5xl"
            />
          </div>

        </div>
      </section>


      {/* Sustainable Development Goals Section */}
      <section className=" bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Our Commitment to Sustainable Development Goals
          </h2>
          <div className="decorative-line mt-20 mb-10"></div>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#e81f2d] transition-all duration-300 hover:scale-105 hover:shadow-xl" data-animate="fade-in-up">
              <img
                src={new URL("/src/assets/SDG1.jpg", import.meta.url).href}
                alt="SDG 1: No Poverty"
                className="w-full h-53 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                We work to eradicate poverty by supporting communities and
                providing resources to build sustainable livelihoods.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#d09f2d] transition-all duration-300 hover:scale-105 hover:shadow-xl" data-animate="fade-in-up">
              <img
                src={new URL("/src/assets/SDG2.jpg", import.meta.url).href}
                alt="SDG 2: Zero Hunger"
                className="w-full h-53 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                We aim to end hunger by connecting food resources with
                communities in need, ensuring no one goes without.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#2b9b4a] transition-all duration-300 hover:scale-105 hover:shadow-xl" data-animate="fade-in-up">
              <img
                src={SDG3Image}
                alt="SDG 3: Good Health and Well-being"
                className="w-full h-53 object-cover rounded-lg mb-4"
              />

              <p className="text-gray-600">
                Promoting health and well-being through access to nutritious
                food and community support.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#cd8c2e] transition-all duration-300 hover:scale-105 hover:shadow-xl" data-animate="fade-in-up">
              <img
                src={SDG12Image}
                alt="SDG 12: Responsible Consumption and Production"
                className="w-full h-53 object-cover rounded-lg mb-4"
              />

              <p className="text-gray-600">
                By reducing food waste and promoting sustainable practices, we
                contribute to efficient resource use.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#4e7a47] transition-all duration-300 hover:scale-105 hover:shadow-xl" data-animate="fade-in-up">
              <img
                src={SDG13Image}
                alt="SDG 13: Climate Action"
                className="w-full h-53 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">
                Minimizing food waste helps reduce greenhouse gas emissions and
                supports climate change mitigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 w-full">
        <div className="px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Our Impact</h2>
          <div className="decorative-line mt-20 mb-10"></div>
          <div className="grid md:grid-cols-4 gap-8 text-center" ref={impactRef}>
            <div className="bg-white p-6 rounded-lg shadow-md" data-animate="fade-in-up">
              <div className="text-4xl font-bold text-green-600 mb-2 animate-pulse-gentle">
                {mealsServed.toLocaleString()}+
              </div>
              <p className="text-gray-600">Meals Served</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-animate="fade-in-up">
              <div className="text-4xl font-bold text-green-600 mb-2 animate-pulse-gentle">
                {ngosConnected}+
              </div>
              <p className="text-gray-600">NGOs Connected</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-animate="fade-in-up">
              <div className="text-4xl font-bold text-green-600 mb-2 animate-pulse-gentle">
                {volunteers.toLocaleString()}+
              </div>
              <p className="text-gray-600">Volunteers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-animate="fade-in-up">
              <div className="text-4xl font-bold text-green-600 mb-2 animate-pulse-gentle">
                ${fundsRaised.toLocaleString()}+
              </div>
              <p className="text-gray-600">Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-0">Join the Mission</h2>
          <p className="text-xl mb-8">
            Be part of the change. Start donating or volunteering today.
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 animate-bounce"
          >
            Join the Mission
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

export default Home;
