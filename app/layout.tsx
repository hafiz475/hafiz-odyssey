import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "J Md Hafizur Rahman | Senior Product Engineer & Full Stack Developer",
  description: "Explore the digital universe of J Md Hafizur Rahman - Senior Product Engineer, Full Stack MERN Developer, and Founder. An interactive 3D journey from Mechanical Engineering to SaaS innovation.",
  keywords: [
    "J Md Hafizur Rahman",
    "Senior Product Engineer",
    "Full Stack MERN Developer",
    "Direction7 Founder",
    "Mechanical Engineer",
    "React Three Fiber",
    "Next.js Developer",
    "3D Portfolio",
  ],
  authors: [{ name: "J Md Hafizur Rahman" }],
  creator: "J Md Hafizur Rahman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${orbitron.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#030303] text-[#f5f5f7] font-sans selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
