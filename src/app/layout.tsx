import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majestic Car Wash | Hand Car Wash & Detailing in Beverly Grove, LA",
  description:
    "Beverly Grove's 100% hand car wash and complete auto detailing. Washes from $31.99, full detail services, and member pricing from $24.99/mo. Open Monday to Saturday 8AM to 6PM, Sunday 8AM to 5PM, one block west of Fairfax.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
