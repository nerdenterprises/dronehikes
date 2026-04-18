import { popupHtml, loadJson } from '../map.js';

const greenIcon = L.divIcon({
  className: 'pin',
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#16a34a;border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.4);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const redIcon = L.divIcon({
  className: 'pin',
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#dc2626;border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.4);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

export async function createSpotsLayer() {
  const spots = await loadJson('data/spots.json');
  const layer = L.layerGroup();
  spots.forEach(s => {
    const icon = s.status === 'prohibited' ? redIcon : greenIcon;
    const marker = L.marker([s.lat, s.lng], { icon });
    const coords = s.lat.toFixed(4) + ', ' + s.lng.toFixed(4);
    marker.bindPopup(popupHtml(s.name, [coords, s.notes], null));
    marker.addTo(layer);
  });
  return layer;
}
