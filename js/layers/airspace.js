import { addShape, loadJson, COLORS } from '../map.js';

export async function createAirspaceLayer() {
  const zones = await loadJson('data/airspace.json');
  const layer = L.layerGroup();
  zones.forEach(z => addShape(layer, z, COLORS.RED, 0.30));
  return layer;
}
