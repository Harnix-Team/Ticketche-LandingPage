"use client";

import { useEffect, useRef } from "react";

const countries = [
  { name: "Bénin",         users: "12 000", code: "bj", left: "calc(49.2% + 8px)",  top: "calc(56.5% + 4px)"  },
  { name: "Nigeria",       users: "30 000", code: "ng", left: "calc(47.8% - 6px)",  top: "calc(53.5% + 2px)"  },
  { name: "Côte d'Ivoire", users: "18 000", code: "ci", left: "calc(42.0% + 9px)",  top: "calc(57.0% - 3px)"  },
  { name: "Sénégal",       users: "8 000",  code: "sn", left: "calc(35.5% - 5px)",  top: "calc(47.5% + 5px)"  },
  { name: "France",        users: "24 000", code: "fr", left: "calc(45.8% + 4px)",  top: "calc(23.0% - 2px)"  },
  { name: "Ghana",         users: "9 500",  code: "gh", left: "calc(44.2% + 7px)",  top: "calc(56.0% + 3px)"  },
  { name: "Cameroun",      users: "7 200",  code: "cm", left: "calc(51.5% - 6px)",  top: "calc(56.5% - 4px)"  },
  { name: "Mali",          users: "4 800",  code: "ml", left: "calc(39.0% + 6px)",  top: "calc(47.0% - 5px)"  },
];

export default function ActiveUsers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Fetch the world GeoJSON and draw dots
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(world => {
        ctx.clearRect(0, 0, W, H);

        // Project lon/lat to canvas pixels (Mercator approximation)
        const project = (lon, lat) => {
          const x = (lon + 180) / 360 * W;
          const latRad = lat * Math.PI / 180;
          const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
          const y = (H / 2) - (W * mercN / (2 * Math.PI));
          return [x, y];
        };

        // Draw dots grid — only inside land polygons
        const DOT_SPACING = 7;
        const DOT_R = 2;

        // First render countries as filled paths into offscreen canvas
        const offscreen = document.createElement("canvas");
        offscreen.width = W;
        offscreen.height = H;
        const octx = offscreen.getContext("2d");
        octx.fillStyle = "#000";

        world.features.forEach(feature => {
          const geom = feature.geometry;
          const polys = geom.type === "Polygon"
            ? [geom.coordinates]
            : geom.type === "MultiPolygon"
            ? geom.coordinates
            : [];

          polys.forEach(poly => {
            poly.forEach(ring => {
              octx.beginPath();
              ring.forEach(([lon, lat], i) => {
                const [px, py] = project(lon, lat);
                i === 0 ? octx.moveTo(px, py) : octx.lineTo(px, py);
              });
              octx.closePath();
              octx.fill();
            });
          });
        });

        // Sample dots
        const imgData = octx.getImageData(0, 0, W, H);
        const isLand = (x, y) => {
          const xi = Math.round(x);
          const yi = Math.round(y);
          if (xi < 0 || xi >= W || yi < 0 || yi >= H) return false;
          const idx = (yi * W + xi) * 4;
          return imgData.data[idx + 3] > 128;
        };

        for (let x = DOT_SPACING; x < W; x += DOT_SPACING) {
          for (let y = DOT_SPACING; y < H; y += DOT_SPACING) {
            if (isLand(x, y)) {
              ctx.beginPath();
              ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
              ctx.fillStyle = "#b8d0d2";
              ctx.fill();
            }
          }
        }
      })
      .catch(() => {
        // Fallback: simple grid
        ctx.clearRect(0, 0, W, H);
      });
  }, []);

  return (
    <section style={{
      fontFamily: "'Archivo', sans-serif",
      padding: "clamp(60px,8vw,100px) clamp(24px,5vw,80px)",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,64px)" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(0,81,90,0.08)",
            color: "#00515a",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            padding: "5px 16px",
            borderRadius: "999px",
            marginBottom: "18px",
          }}>Utilisateurs Actifs</span>
          <h2 style={{
            fontSize: "clamp(1.7rem,3.2vw,2.6rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: "#0a1a1c",
            margin: "0 auto",
            maxWidth: "680px",
          }}>
            Ticketché s'implante partout<br/>
            avec des milliers d'utilisateurs actifs
          </h2>
        </div>

        {/* Map */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "50%" }}>
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Country pins */}
          {countries.map((c) => (
            <div key={c.code} style={{
              position: "absolute",
              left: c.left,
              top: c.top,
              transform: "translate(-50%, -100%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "7px 13px 7px 7px",
                  boxShadow: "0 4px 20px rgba(0,30,34,0.13), 0 1px 3px rgba(0,30,34,0.07)",
                  border: "1px solid rgba(0,81,90,0.07)",
                  whiteSpace: "nowrap",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,30,34,0.18)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,30,34,0.13)";
                }}
              >
                <img
                  src={`https://flagcdn.com/w40/${c.code}.png`}
                  srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                  alt={c.name}
                  style={{
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid #e8f0f1",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0a1a1c", lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "1px" }}>{c.users} utilisateurs</div>
                </div>
              </div>
              <div style={{ width: "1.5px", height: "12px", background: "#00515a", opacity: 0.45 }}/>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#00515a",
                boxShadow: "0 0 0 3px rgba(0,81,90,0.2)",
              }}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}