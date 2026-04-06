import "./globals.css";

export const metadata = {
  title: "つのだ商店",
  description: "予約・サービス案内",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}