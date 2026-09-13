import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon() {
  const squirrel = await readFile(join(process.cwd(), "public", "images", "logo-squirrel.png"))
  const src = `data:image/png;base64,${squirrel.toString("base64")}`
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E3A5F",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 148,
            height: 148,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            background: "#F7F4EE",
          }}
        >
          <img src={src} height={148} alt="" />
        </div>
      </div>
    ),
    { ...size },
  )
}
