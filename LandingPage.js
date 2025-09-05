import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Hero slider images
const sliderImages = [
  "https://as1.ftcdn.net/jpg/15/67/61/72/1000_F_1567617279_4XW39azKRHZL5NazfYN9hT5rMQt5tpGX.jpg",
  "https://t4.ftcdn.net/jpg/06/63/18/85/240_F_663188547_Nxk5KK1A3qjDbcq38DJFOMBPNIyNaGHN.jpg",
  "https://t4.ftcdn.net/jpg/07/51/22/87/240_F_751228767_JmOBk71ZUrE7g26oVoeKQWlpduHjiWvO.jpg",
];

// Feature images
const lessonImg = "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format&fit=crop&q=60";
const quizImg = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=60";
const teacherImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIQBwACDm9n9Oj35xTjZaXDSOcQtucDLxtPw&s";

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll for navbar links
  const handleScroll = (e, id) => {
    e.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white shadow-md transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-8">
          <Link to="/" className="text-2xl font-bold text-cyan-600">LevelUp</Link>
          <div className="space-x-4 md:space-x-6">
            <a href="#about" onClick={(e) => handleScroll(e, "about")} className="hover:text-cyan-600 transition">About</a>
            <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="hover:text-cyan-600 transition">Contact</a>
            <Link to="/login" className="text-cyan-600 px-3 py-2 border border-cyan-600 rounded hover:bg-cyan-50 transition">Login</Link>
            <Link to="/signup" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${sliderImages[currentSlide]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        <div className="relative z-10 px-4 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">LevelUp Your Learning!</h2>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-6 drop-shadow-md">
            Personalized learning for O-Level students with interactive lessons and quizzes.
          </p>
          <Link
            to="/signup"
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Slider Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition">‹</button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition">›</button>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white text-center">
        <h3 className="text-3xl font-bold text-cyan-600 mb-6">About LevelUp</h3>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
          LevelUp is an innovative learning platform for O-Level students. Take lessons, attempt quizzes, and track your progress. Teachers can upload materials and interact with students easily.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <h3 className="text-3xl font-bold text-cyan-600 mb-12 text-center">Our Features</h3>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: lessonImg, title: "Interactive Lessons", desc: "Fun, engaging lessons to help students learn effectively." },
            { img: quizImg, title: "Quizzes & Feedback", desc: "Instant feedback on quizzes to track your progress." },
            { img: teacherImg, title: "Teacher Support", desc: "Teachers can upload materials and guide students anytime." },
          ].map((feature, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center">
              <img src={feature.img} alt={feature.title} className="mx-auto mb-4 rounded-full w-32 h-32 object-cover"/>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12 bg-gray-50 text-center">
        <h3 className="text-3xl font-bold text-cyan-600 mb-6">Contact Us</h3>
        <form className="max-w-xl mx-auto flex flex-col gap-4">
          <input type="text" placeholder="Your Name" className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <input type="email" placeholder="Your Email" className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          <textarea placeholder="Your Message" rows={5} className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"></textarea>
          <button type="submit" className="bg-cyan-500 text-white px-6 py-3 rounded hover:bg-cyan-600 transition-transform transform hover:scale-105">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-cyan-600 text-white text-center">
        &copy; {new Date().getFullYear()} LevelUp. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
