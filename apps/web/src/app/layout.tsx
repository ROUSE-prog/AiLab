import "./globals.css";

export const metadata = {
  title: "AiLab",
  description: "Prompt Playground",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}