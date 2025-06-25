
import React from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Material pricing (₹ per cm³)
export const MATERIAL_RATES = {
  'PLA': 2.5,
  'PET-G': 3.0,
  'ABS': 2.8,
  'TPU': 4.5,
  'RESIN': 8.0
};

interface PrintSettingsProps {
  material: string;
  infill: number[];
  layerHeight: string;
  onMaterialChange: (material: string) => void;
  onInfillChange: (infill: number[]) => void;
  onLayerHeightChange: (layerHeight: string) => void;
}

export function PrintSettings({
  material,
  infill,
  layerHeight,
  onMaterialChange,
  onInfillChange,
  onLayerHeightChange
}: PrintSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Print Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Material Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Material</label>
          <Select value={material} onValueChange={onMaterialChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLA">PLA (₹{MATERIAL_RATES.PLA}/cm³)</SelectItem>
              <SelectItem value="PET-G">PET-G (₹{MATERIAL_RATES['PET-G']}/cm³)</SelectItem>
              <SelectItem value="ABS">ABS (₹{MATERIAL_RATES.ABS}/cm³)</SelectItem>
              <SelectItem value="TPU">TPU (₹{MATERIAL_RATES.TPU}/cm³)</SelectItem>
              <SelectItem value="RESIN">RESIN (₹{MATERIAL_RATES.RESIN}/cm³)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Infill Percentage */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Infill: {infill[0]}%
          </label>
          <Slider
            value={infill}
            onValueChange={onInfillChange}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        {/* Layer Height */}
        <div>
          <label className="block text-sm font-medium mb-2">Layer Height</label>
          <Select value={layerHeight} onValueChange={onLayerHeightChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.1">0.1mm (High Quality)</SelectItem>
              <SelectItem value="0.2">0.2mm (Standard)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
