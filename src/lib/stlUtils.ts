

/** Load an STL file into a Three.js BufferGeometry */
export const loadSTL = (file: File): Promise<THREE.BufferGeometry> =>
  new Promise((res, rej) =>
    new STLLoader().load(URL.createObjectURL(file), res, undefined, rej)
  );

/** Calculate a solid’s volume (cm³) from its geometry */
export const computeVolumeCm3 = (geo: THREE.BufferGeometry) => {
  const pos = geo.attributes.position;
  let vol = 0;
  const a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    vol += a.dot(b.cross(c));      // signed tetra volume
  }
  return Math.abs(vol) / 6 / 1000; // mm³ → cm³
};