import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* College Info */}
        <div>
          <h2 className="text-xl font-semibold">College Name</h2>
          <p className="mt-2 text-gray-400">
            Empowering students with quality education and innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/about" className="text-gray-400 hover:text-white">Attendance</a></li>
            <li><a href="/events" className="text-gray-400 hover:text-white">Assignments</a></li>
            <li><a href="/faculty" className="text-gray-400 hover:text-white">Notice Board</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-white">Grade Tracking</a></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="mt-2 text-gray-400">Email: info@college.edu</p>
          <p className="text-gray-400">Phone: +123 456 7890</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-blue-500"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-pink-500"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaLinkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400">
        © {new Date().getFullYear()} Team Loosers. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
