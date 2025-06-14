import { useState } from "react";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MATERIAL_RATES_INR, useQuoteCalculation } from "@/hooks/useQuoteCalculation";
import Model3DViewer from "@/components/quote/Model3DViewer";
import AddToCartButton from "@/components/quote/AddToCartButton";

export default function QuotePage() {
  const [file, setFile]         = useState<File | null>(null);
  const [material, setMaterial] = useState<keyof typeof MATERIAL_RATES_INR>("PLA");
  const [infill, setInfill]     = useState(20);

  const { volume, price } = useQuoteCalculation(file, material, infill);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <Navbar />
    <section className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Upload control */}
      <input
        type="file"
        accept=".stl"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />

      {/* Preview */}
      <Model3DViewer file={file} />

      {/* Settings */}
      <div className="grid sm:grid-cols-3 gap-4 items-center">
        <select
          className="border rounded p-2"
          value={material}
          onChange={e => setMaterial(e.target.value as any)}
        >
          {Object.keys(MATERIAL_RATES_INR).map(mat => (
            <option key={mat}>{mat}</option>
          ))}
        </select>

        <input
          type="range"
          min={10} max={100} step={5}
          value={infill}
          onChange={e => setInfill(Number(e.target.value))}
        />
        <span>{infill}% infill</span>
      </div>

      {/* Summary + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-lg font-semibold">
          Volume {volume.toFixed(2)} cm³   |   Price ₹{price}
        </p>

        <AddToCartButton
          file={file}
          material={material}
          infill={infill}
          price={price}
        />
      </div>
    </section>
    <Footer />
    </div>
  );
}