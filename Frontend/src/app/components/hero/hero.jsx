// components/hero/Hero.jsx
import Link from "next/link";

export default function Hero() {
return (
<div className="relative w-full h-screen overflow-hidden">
    <video
    src="/images/MechanicWork.mp4"
    autoPlay
    loop
    muted
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
    />
    <div className="absolute top-0 left-0 w-full z-20">
    {/* Navbar comes from layout */}
    </div>
    <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
    <div>
        <h1 className="text-[25px] md:text-[35px] lg:text-[45px] mb-4 tracking-[0.7rem] text-white font-extrabold uppercase drop-shadow-[3px_3px_5px_rgba(0,0,0,0.7)]">
        Welcome to Car Workshop
        </h1>
        <p className="text-white font-medium text-lg md:text-base drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] px-4 py-2 rounded-lg max-w-2xl mx-auto">
        We provide the best service packages, appointment bookings, and to your preferred mechanic services.
        </p>
        <Link
        href="/appointment"
        className="bg-emerald-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition mt-4 inline-block"
        >
        Book Now
        </Link>
    </div>
    </div>
</div>
);
}
