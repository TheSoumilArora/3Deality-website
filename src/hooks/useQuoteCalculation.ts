import { useEffect, useState } from "react";
import { loadSTL, computeVolumeCm3 } from "@/lib/stlUtils";

export const MATERIAL_RATES_INR = {
  PLA:   3.0,
  PETG:  3.5,
  ABS:   4.0,
  TPU:   4.5,
  RESIN: 6.0,
} as const;

export function useQuoteCalculation(
  file: File | null,
  material: keyof typeof MATERIAL_RATES_INR,
  infillPercent: number,
) {
  const [volume, setVolume] = useState(0);           // cm³

  useEffect(() => {
    if (!file) { setVolume(0); return; }
    loadSTL(file)
      .then(geo => setVolume(computeVolumeCm3(geo)))
      .catch(() => setVolume(0));
  }, [file]);

  const base      = 50;                              // ₹ flat
  const matRate   = MATERIAL_RATES_INR[material];
  const matCost   = volume * (infillPercent / 100) * matRate;
  const timeCost  = volume * 0.15 * 8;               // 0.15 min/cm³ · ₹8/min
  const price     = Math.ceil(base + matCost + timeCost);

  return { volume, price };
}