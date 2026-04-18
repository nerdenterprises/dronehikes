import { addShape, loadJson, COLORS } from '../map.js';

export async function createNpsLayer() {
  const zones = await loadJson('data/nps.json');
  const layer = L.layerGroup();
  zones.forEach(z => addShape(layer, z, COLORS.RED, 0.40));
  return layer;
}
