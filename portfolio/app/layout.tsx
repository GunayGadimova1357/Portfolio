import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ConditionalFooter } from '@/components/layout/conditional-footer';
import { GlobalLoader } from '@/components/ui/global-loader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <GlobalLoader />
        <Navbar /> 

        <div className="relative z-10">
          <main>{children}</main>
          <ConditionalFooter>
            <Footer />
          </ConditionalFooter>
        </div>
      </body>
    </html>
  );
}
