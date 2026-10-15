import { ImageResponse } from "next/og";
import { colors } from "@forja/brand";
import { logomarkDataUri } from "./brand-asset";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await logomarkDataUri();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.marino,
          borderRadius: 14,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} width={52} height={52} alt="" />
        ) : (
          <span style={{ color: colors.blanco, fontSize: 40, fontWeight: 900 }}>F</span>
        )}
      </div>
    ),
    size,
  );
}
