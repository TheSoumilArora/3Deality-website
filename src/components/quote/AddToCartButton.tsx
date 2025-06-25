
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

type Props = {
  file: File | null;
  material: string;
  infill: number;
  price: number;
};

export default function AddToCartButton({ file, material, infill, price }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (!file) return toast.error("Upload an STL first");

    try {
      addToCart({
        filename: file.name,
        material,
        infill,
        layerHeight: "0.2", // Default layer height
        price
      });

      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart");
    }
  };

  return (
    <Button onClick={handleAdd} disabled={!file}>
      Add&nbsp;to&nbsp;Cart&nbsp;— ₹{price}
    </Button>
  );
}
