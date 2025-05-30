import type { Metadata } from "next";
import "../styles/main.scss";
import ClientProviders from '@/context/ClientProviders';

export const metadata: Metadata = {
  title: "Notes",
  description: "Semantic notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#0f172a' }}>
      <body
        className="antialiased"
        style={{ 
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
          backgroundColor: "#0f172a"
        }}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

