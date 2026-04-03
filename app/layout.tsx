import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "CRM Dashboard",
  description: "Customer & Reservation Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gray-100 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}