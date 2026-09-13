import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default async function Icon() {
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
            width: 400,
            height: 400,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 36,
            background: "#F7F4EE",
          }}
        >
          <img src={src} height={400} alt="" />
        </div>
      </div>
    ),
    { ...size },
  )
}
