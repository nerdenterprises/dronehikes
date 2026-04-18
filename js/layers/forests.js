import { addShape, loadJson, COLORS } from '../map.js';

export async function createForestLayer() {
  const zones = await loadJson('data/forests.json');
  const layer = L.layerGroup();
  zones.forEach(z => addShape(layer, z, COLORS.YELLOW, 0.20));
  return layer;
}
