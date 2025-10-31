import {
  Space_Grotesk,
  Noto_Sans_Sunuwar,
  Work_Sans,
  VT323,
  Press_Start_2P,
} from "next/font/google";

export const fontGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const fontNotoSansSunuwar = Noto_Sans_Sunuwar({
  weight: ["400"],
  subsets: ["latin", "sunuwar"],
  variable: "--font-noto-sans-sunuwar",
});

export const fontWorkSans = Work_Sans({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const fontVT323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const fontPressStart2P = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});
