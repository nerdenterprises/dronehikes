import { loadJson } from '../map.js';

const blueIcon = L.divIcon({
  className: 'pin',
  html: '<div style="width:22px;height:22px;border-radius:4px;background:#2563eb;border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;letter-spacing:-0.5px;">RC</div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function clubPopup(c) {
  let html = '<div class="pt">' + c.name + '</div>';
  html += '<div class="pm"><strong>Address:</strong> ' + c.address + '</div>';
  if (c.website) {
    const display = c.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    html += '<div class="pm"><strong>Web:</strong> <a href="' + c.website + '" target="_blank" rel="noopener">' + display + '</a></div>';
  }
  if (c.amaNumber) html += '<div class="pm"><strong>AMA #:</strong> ' + c.amaNumber + '</div>';
  html += '<div class="pm"><strong>Guests:</strong> ' + c.guestNotes + '</div>';
  if (c.notes) html += '<div class="pm">' + c.notes + '</div>';
  return html;
}

function clubCard(c, marker, map) {
  const card = document.createElement('div');
  card.className = 'dir-card';
  let html = '<p class="dir-name">' + c.name + '</p>';
  html += '<p class="dir-meta">' + c.address + '</p>';
  if (c.website) {
    const display = c.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    html += '<p class="dir-meta"><strong>Web:</strong> <a href="' + c.website + '" target="_blank" rel="noopener" onclick="event.stopPropagation();">' + display + '</a></p>';
  }
  if (c.amaNumber) html += '<p class="dir-meta"><strong>AMA #:</strong> ' + c.amaNumber + '</p>';
  html += '<p class="dir-meta"><strong>Guests:</strong> ' + c.guestNotes + '</p>';
  card.innerHTML = html;
  card.addEventListener('click', () => {
    map.setView([c.lat, c.lng], 14);
    marker.openPopup();
    document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  return card;
}

export async function createClubsLayer(map) {
  const clubs = await loadJson('data/clubs.json');
  const layer = L.layerGroup();
  const dirEl = document.getElementById('club-directory');

  clubs.forEach(c => {
    const marker = L.marker([c.lat, c.lng], { icon: blueIcon });
    marker.bindPopup(clubPopup(c));
    marker.addTo(layer);
    dirEl.appendChild(clubCard(c, marker, map));
  });

  return layer;
}
