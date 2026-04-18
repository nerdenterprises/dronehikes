export const COLORS = {
  RED: '#dc2626',
  YELLOW: '#eab308',
  GREEN: '#16a34a',
  BLUE: '#2563eb'
};

export function createMap() {
  const map = L.map('map', { zoomControl: true }).setView([34.6, -118.5], 7);

  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri', maxZoom: 18
  });
  const satelliteLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: '', maxZoom: 18
  });
  const satelliteGroup = L.layerGroup([satellite, satelliteLabels]);

  const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap (CC-BY-SA)',
    maxZoom: 17, subdomains: 'abc'
  });

  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 19
  });

  satelliteGroup.addTo(map);

  const baseLayers = { 'Satellite': satelliteGroup, 'Terrain': terrain, 'Street': street };
  return { map, baseLayers };
}

export function fillStyle(color, opacity) {
  return { color, fillColor: color, fillOpacity: opacity || 0.25, weight: 1.5 };
}

export function popupHtml(title, lines, warning) {
  let html = '<div class="pt">' + title + '</div>';
  lines.forEach(l => { html += '<div class="pm">' + l + '</div>'; });
  if (warning) html += '<div class="pw">' + warning + '</div>';
  return html;
}

export function addShape(layer, zone, color, defaultOpacity) {
  const opacity = zone.opacity ?? defaultOpacity;
  const style = fillStyle(color, opacity);
  let shape;
  if (zone.shape === 'polygon') {
    shape = L.polygon(zone.geometry, style);
  } else {
    shape = L.circle(zone.geometry.center, { radius: zone.geometry.radiusMeters, ...style });
  }
  shape.bindPopup(popupHtml(zone.popup.title, zone.popup.lines, zone.popup.warning));
  shape.addTo(layer);
  return shape;
}

export async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path + ': ' + res.status);
  return res.json();
}
