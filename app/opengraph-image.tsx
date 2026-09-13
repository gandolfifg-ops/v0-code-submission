import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "WealthNutz — Student finance for Canada & the US"

export default async function OpenGraphImage() {
  const squirrel = await readFile(join(process.cwd(), "public", "images", "logo-squirrel.png"))
  const src = `data:image/png;base64,${squirrel.toString("base64")}`
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E3A5F",
          color: "#F7F4EE",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 220,
            height: 220,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "#F7F4EE",
            marginBottom: 28,
          }}
        >
          <img src={src} height={220} alt="" />
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
          WealthNutz
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 28, color: "#C9A227" }}>
          Student finance for Canada & the US
        </div>
      </div>
    ),
    { ...size },
  )
}
