import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convertisseur de devises",
  description:
    "Convertissez facilement des devises en temps réel avec notre outil simple et efficace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
