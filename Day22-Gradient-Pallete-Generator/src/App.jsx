import { useState, useEffect } from "react";
import chroma from "chroma-js";

export default function PaletteMaker() {
  const [palette, setPalette] = useState([]);
  const [colorCount, setColorCount] = useState(3);
  const [gradientType, setGradientType] = useState("linear");
  const [direction, setDirection] = useState("to right");
  const [copied, setCopied] = useState(false);
  const [overlayImage, setOverlayImage] = useState(false);

  const generatePalette = () => {
    const newPalette = Array.from({ length: colorCount }, () => `#${Math.random().toString(16).slice(2, 8).padEnd(6, "0")}`);
    setPalette(newPalette);
  };

  const handleColorChange = (index, value) => {
    const updated = [...palette];
    updated[index] = value;
    setPalette(updated);
  };

  const handleHSLChange = (index, property, value) => {
    const hsl = chroma(palette[index]).hsl();
    if (property === "h") hsl[0] = value;
    if (property === "s") hsl[1] = value / 100;
    if (property === "l") hsl[2] = value / 100;
    const updated = [...palette];
    updated[index] = chroma.hsl(...hsl).hex();
    setPalette(updated);
  };

  useEffect(() => {
    if (colorCount > 4) setColorCount(4);
    else generatePalette();
  }, [colorCount]);

  const cssGradient =
    gradientType === "linear"
      ? `linear-gradient(${direction}, ${palette.join(", ")})`
      : gradientType === "radial"
      ? `radial-gradient(circle, ${palette.join(", ")})`
      : `conic-gradient(at center, ${palette.join(", ")})`;

  const gradientStyle = {
    background: cssGradient,
    height:
      gradientType === "radial" || gradientType === "conic"
        ? "300px"
        : "120px",
    borderRadius:
      gradientType === "radial" || gradientType === "conic"
        ? "50%"
        : "1rem",
    width:
      gradientType === "radial" || gradientType === "conic"
        ? "300px"
        : "100%",
    backgroundSize: "400% 400%",
    animation: "gradientFlow 10s ease infinite",
    backgroundImage: overlayImage
      ? `url('https://www.transparenttextures.com/patterns/stardust.png'), ${cssGradient}`
      : cssGradient,
    transition: "all 0.4s ease-in-out",
    boxShadow: "0 0 12px rgba(255, 255, 255, 0.1)"
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${cssGradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 via-gray-900 to-slate-900 text-white p-6 flex flex-col items-center">
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <h1 className="text-4xl font-bold mb-6 tracking-wide">🌈 Gradient Generator</h1>

      <div className="mb-6 max-w-4xl flex justify-center items-center" style={gradientStyle}>
        <p className="text-center text-white/70 text-lg">Live Gradient Preview</p>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4 justify-center items-center text-white">
        <label className="text-lg"># of Colors: {colorCount}</label>
        <input
          type="range"
          min="2"
          max="4"
          value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
          className="w-40"
        />

        <select
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value)}
          className="bg-white text-black p-1 rounded"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
          <option value="conic">Conic</option>
        </select>

        {gradientType === "linear" && (
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="bg-white text-black p-1 rounded"
          >
            <option value="to right">→ To Right</option>
            <option value="to left">← To Left</option>
            <option value="to top">↑ To Top</option>
            <option value="to bottom">↓ To Bottom</option>
            <option value="to top right">↗ To Top Right</option>
            <option value="to bottom left">↙ To Bottom Left</option>
          </select>
        )}

        <button
          onClick={() => setOverlayImage(!overlayImage)}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
        >
          {overlayImage ? "Remove Overlay" : "Add Texture"}
        </button>

        <button
          onClick={copyToClipboard}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
        >
          {copied ? "✅ Copied" : "Copy CSS"}
        </button>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {palette.map((color, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full shadow-lg ring-2 ring-white/20 cursor-pointer mb-2"
              style={{ backgroundColor: color }}
              title={color}
            ></div>

            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(idx, e.target.value)}
              className="mb-2"
            />

            <div className="text-xs text-white/80 space-y-1 w-40">
              <div className="flex items-center gap-1">
                <label className="w-5">H</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={Math.round(chroma(color).hsl()[0])}
                  onChange={(e) => handleHSLChange(idx, "h", +e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1">
                <label className="w-5">S</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(chroma(color).hsl()[1] * 100)}
                  onChange={(e) => handleHSLChange(idx, "s", +e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1">
                <label className="w-5">L</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(chroma(color).hsl()[2] * 100)}
                  onChange={(e) => handleHSLChange(idx, "l", +e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}