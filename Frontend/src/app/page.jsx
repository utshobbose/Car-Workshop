// import Link from "next/link";
// import Navbar from "./components/navbar/Navbar";
// import Footer from "./components/footer/footer";

// export default function Home() {
//   return (
//     <div className="relative w-screen h-screen overflow-hidden">

//       {/* Background video */}
//       <video
//         src="/images/MechanicWork.mp4"
//         autoPlay
//         loop
//         muted
//         preload="metadata"
//         className="absolute top-0 left-0 w-full h-full object-cover z-0"
//       ></video>

//       {/* Navbar over video */}
//       <div className="absolute top-0 left-0 w-full z-20">
//         <Navbar />
//       </div>

//       {/* Main hero content */}
//       <div className="absolute z-10 w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//         <div className="flex items-center justify-center flex-col w-full h-full px-4">
//           <div className="text-center">
//             <h1 className="text-[25px] md:text-[35px] lg:text-[45px] mb-4 tracking-[0.7rem] text-white font-extrabold uppercase drop-shadow-[3px_3px_5px_rgba(0,0,0,0.7)]">
//               Welcome to Car Workshop
//             </h1>
//             <p className="text-white font-medium text-lg md:text-base drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] px-4 py-2 rounded-lg">
//               We provide the best service packages, appointment bookings, and to your preferred mechanic services. We are here to make your service experience memorable.
//             </p>
//           </div>
//           <Link
//             href="/appointment"
//             className="bg-emerald-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition mt-4"
//           >
//             Book Now
//           </Link>
//         </div>
//       </div>
//      {/* Footer */}
//       <div className="relative z-10">
//       <Footer />
//       </div>
//     </div>
//   );
import Hero from "./components/hero/Hero";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
      <Hero />
      <Footer />
    </>
  );
}
