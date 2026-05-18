import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function IconLarge() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fa500f 0%, #ff8a3d 60%, #ffb56c 100%)",
          fontSize: 300,
          lineHeight: 1,
        }}
      >
        📚
      </div>
    ),
    { ...size, emoji: "twemoji" },
  );
}
