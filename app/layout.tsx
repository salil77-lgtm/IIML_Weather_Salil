import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"SkyCast Weather",description:"Current weather and 7-day forecasts worldwide"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
