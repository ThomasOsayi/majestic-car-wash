import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majestic Car Wash — Hand Car Wash & Detailing | Beverly Grove, LA",
  description:
    "No machines. No shortcuts. No swirl marks. Real people who care, washing every car by hand for over 40 years. Unlimited memberships starting at $34.99/mo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}