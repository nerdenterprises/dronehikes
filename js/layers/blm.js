import { addShape, loadJson, COLORS } from '../map.js';

export async function createBlmLayer() {
  const zones = await loadJson('data/blm.json');
  const layer = L.layerGroup();
  zones.forEach(z => addShape(layer, z, COLORS.GREEN, 0.25));
  return layer;
}
