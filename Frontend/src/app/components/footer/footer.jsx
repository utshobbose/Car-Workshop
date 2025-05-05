import React from "react";

const Footer = () => {
return (
<footer className="bg-black bg-opacity-80 text-white text-sm md:text-base px-4 py-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center md:text-left">
    <div>
        <h2 className="text-xl font-bold mb-2">Car Workshop</h2>
        <p>Top-quality car repair and maintenance service at your convenience.</p>
    </div>
    <div>
        <h2 className="text-xl font-bold mb-2">Quick Links</h2>
        <ul className="space-y-1">
        <li><a href="/appointment" className="hover:underline">Book Appointment</a></li>
        <li><a href="/services" className="hover:underline">Our Services</a></li>
        <li><a href="/contact" className="hover:underline">Contact</a></li>
        </ul>
    </div>
    <div>
        <h2 className="text-xl font-bold mb-2">Contact Us</h2>
        <p>Email: support@carworkshop.com</p>
        <p>Phone: +880 1234-567890</p>
        <p>Dhaka, Bangladesh</p>
    </div>
    </div>
    <div className="mt-6 text-center border-t border-gray-700 pt-4">
    &copy; {new Date().getFullYear()} Car Workshop. All rights reserved.
    </div>
</footer>
);
};

export default Footer;
