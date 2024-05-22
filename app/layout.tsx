import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { getFrameMetadata } from "@coinbase/onchainkit";

const montserrat = Montserrat({ subsets: ["latin"] });

const DEGEN_URL = process.env.DEGEN_URL;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Click to claim your airdrop!',
      action: 'post'
    },
    {
      label: 'Donate to help fund LP',
      action: 'post_redirect'
    }
  ],
  post_url: DEGEN_URL + '/api/frame',
  image: DEGEN_URL + '/images/DefaultFrame.png'
});

export const metadata: Metadata = {
  title: "Deframe Token | Claim Your Airdrop",
  description: "The first Degen airdrop using Farcaster Frames!, Build for the Community",
  openGraph: {
    title: "Deframe Token | Claim Your Airdrop",
    description: "The first Degen airdrop using Farcaster Frames!, Build for the Community",
    images: [
      {
        url: DEGEN_URL + "/images/DefaultFrame.png",
        width: 900,
        height: 1600,
        alt: 'Deframe Token',
      }
    ]
  },
  other: {
    ...frameMetadata
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}
