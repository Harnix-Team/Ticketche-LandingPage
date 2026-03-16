"use client";
import { useEffect, useState } from "react";
import { getDownloadLink } from "@/utils/deviceDetection";

export default function DownloadLink({ children, className, style, target = "_blank", rel = "noopener noreferrer" }) {
  const [href, setHref] = useState("https://play.google.com/store/apps/details?id=com.harnixsas.ticketche");
  
  useEffect(() => {
    setHref(getDownloadLink());
  }, []);

  return (
    <a href={href} target={target} rel={rel} className={className} style={style}>
      {children}
    </a>
  );
}