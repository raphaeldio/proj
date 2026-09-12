/**
 * Deklarasi tipe untuk berkas peta.
 *
 * Sengaja TIDAK memakai resolveJsonModule: dengan berkas sebesar ini,
 * TypeScript akan menyimpulkan tipe literal raksasa dan membuat typecheck
 * melambat drastis. Bentuknya sudah pasti, jadi cukup dideklarasikan.
 */
declare module "*.geo.json" {
  const value: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      properties: { code: string; name: string; island: string };
      geometry: GeoJSON.Geometry;
    }>;
  };
  export default value;
}
