import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HowMuchBook — 이 책 얼마야?",
    short_name: "HowMuchBook",
    description: "한 권의 책을 알라딘 중고/매장/eBook + 리디북스에서 한눈에 비교",
    start_url: "/",
    display: "standalone",
    background_color: "#fff4d6",
    theme_color: "#fa500f",
    orientation: "portrait",
    lang: "ko",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
