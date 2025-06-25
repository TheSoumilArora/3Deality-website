
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MATERIAL_RATES } from './PrintSettings';

interface CostBreakdownProps {
  material: string;
  infill: number[];
  volume: number;
}

export function CostBreakdown({ material, infill, volume }: CostBreakdownProps) {
  const basePrice = 50; // ₹
  const materialRate = MATERIAL_RATES[material as keyof typeof MATERIAL_RATES];
  const infillMultiplier = infill[0] / 100;
  const timeRate = 8; // ₹ per minute
  const estimatedTime = volume * 45; // minutes (placeholder calculation)
  
  const totalPrice = Math.round(
    basePrice + 
    (volume * infillMultiplier * materialRate) + 
    (estimatedTime * timeRate)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Base Price</span>
          <span>₹{basePrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Material Cost ({volume}cm³)</span>
          <span>₹{Math.round(volume * infillMultiplier * materialRate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Print Time ({Math.round(estimatedTime)}min)</span>
          <span>₹{Math.round(estimatedTime * timeRate)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{totalPrice}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Estimated delivery: 24-48 hours
        </div>
      </CardContent>
    </Card>
  );
}
