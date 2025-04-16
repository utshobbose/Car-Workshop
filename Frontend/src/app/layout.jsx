import './globals.css';
import NavbarWrapper from './components/navbar/NavbarWrapper';

export const metadata = {
  title: 'Car Work Appointment System',
  description: 'Online appointment system for car mechanics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <NavbarWrapper />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}