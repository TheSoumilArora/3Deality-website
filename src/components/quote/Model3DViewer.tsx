import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { loadSTL } from "@/lib/stlUtils";

export default function Model3DViewer({ file }: { file: File | null }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry>();

  useEffect(() => {
    if (!file) { setGeometry(undefined); return; }
    loadSTL(file).then(setGeometry);
  }, [file]);

  if (!geometry) {
    return (
      <div className="w-full h-80 flex items-center justify-center rounded-xl bg-muted">
        <p className="text-sm text-muted-foreground">Upload an STL to preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden bg-muted">
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <Suspense fallback={null}>
          <mesh geometry={geometry}>
            <meshStandardMaterial color="#4A6CF7" metalness={0.1} roughness={0.6} />
          </mesh>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
