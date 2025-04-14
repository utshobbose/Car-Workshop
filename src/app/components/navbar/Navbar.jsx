export default function Navbar() {
  return (
    <nav className="w-full absolute top-0 left-0 z-20 px-6 py-4 flex items-center justify-between text-white">
      <div className="text-xl font-bold">Car Workshop</div>
      <div className="space-x-4 text-sm md:text-base">
        <a href="/" className="hover:underline">Home</a>
        <a href="/appointment" className="hover:underline">Appointment</a>
        <a href="/admin" className="hover:underline">Admin</a>
        <a href="/signup" className="hover:underline">Sign Up</a>
        <a href="/login" className="hover:underline">Login</a>
      </div>
    </nav>
  );
}