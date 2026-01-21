import "@/styles/globals.scss";
import "animate.css";
import { DM_Sans } from "next/font/google";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LenisProvider from "./components/lenis/LenisProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "EVVR Capital",
  description: "EVVR Capital is the Private Investment Office of the Australian based Powell Family, founded on the belief that every investment carries a responsibility to grow, protect and create something lasting. We invest with conviction, partner with excellence, and maintain an unconstrained global reach.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable}`}>
        <LenisProvider>
          <div className="bodywrapper">
            <Header/>
            {children}
            <Footer/>
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
