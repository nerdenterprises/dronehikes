export function wireControls(map, layers) {
  const detailedBtn = document.getElementById('dm-detailed');
  const simpleBtn = document.getElementById('dm-simple');
  const { airspace, nps, forest, blm, spots, clubs } = layers;

  detailedBtn.addEventListener('click', function() {
    this.classList.add('active');
    simpleBtn.classList.remove('active');
    [airspace, nps, forest, blm, spots, clubs].forEach(l => l.addTo(map));
  });

  simpleBtn.addEventListener('click', function() {
    this.classList.add('active');
    detailedBtn.classList.remove('active');
    map.removeLayer(airspace);
    map.removeLayer(nps);
    map.removeLayer(forest);
    blm.addTo(map);
    spots.addTo(map);
    clubs.addTo(map);
  });

  document.getElementById('dm-ojai').addEventListener('click', () => {
    map.setView([34.45, -119.24], 11);
  });

  document.getElementById('dm-wide').addEventListener('click', () => {
    map.setView([34.6, -118.5], 7);
  });
}

export function addLayerControl(map, baseLayers, layers) {
  const overlays = {
    'Controlled airspace': layers.airspace,
    'National Parks': layers.nps,
    'National Forests': layers.forest,
    'Open / BLM lands': layers.blm,
    'Verified spots': layers.spots,
    'RC clubs': layers.clubs
  };
  L.control.layers(baseLayers, overlays, { collapsed: false, position: 'topright' }).addTo(map);
}
