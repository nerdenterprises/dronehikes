import { createMap } from './map.js';
import { wireControls, addLayerControl } from './ui.js';
import { createAirspaceLayer } from './layers/airspace.js';
import { createNpsLayer } from './layers/nps.js';
import { createForestLayer } from './layers/forests.js';
import { createBlmLayer } from './layers/blm.js';
import { createSpotsLayer } from './layers/spots.js';
import { createClubsLayer } from './layers/clubs.js';

async function init() {
  const { map, baseLayers } = createMap();

  const [airspace, nps, forest, blm, spots, clubs] = await Promise.all([
    createAirspaceLayer(),
    createNpsLayer(),
    createForestLayer(),
    createBlmLayer(),
    createSpotsLayer(),
    createClubsLayer(map)
  ]);

  const layers = { airspace, nps, forest, blm, spots, clubs };

  airspace.addTo(map);
  nps.addTo(map);
  forest.addTo(map);
  blm.addTo(map);
  spots.addTo(map);
  clubs.addTo(map);

  addLayerControl(map, baseLayers, layers);
  wireControls(map, layers);
}

init().catch(err => {
  console.error('Failed to initialize map:', err);
});
