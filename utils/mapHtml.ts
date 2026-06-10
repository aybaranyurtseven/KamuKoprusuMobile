export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  status: string;
  color: string;
}

// Basit HTML/JS güvenliği: etiket karakterlerini ayıkla.
const sanitize = (s: string) => s.replace(/[<>]/g, '');

/**
 * Leaflet + OpenStreetMap kullanan, bağımsız bir harita HTML'i üretir.
 * İşaretçiler renkli daireler olarak çizilir; tıklanınca başlık + durum açılır.
 * API anahtarı gerektirmez.
 */
export function buildMapHtml(markers: MapMarker[]): string {
  const safe = markers.map((m) => ({ ...m, title: sanitize(m.title), status: sanitize(m.status) }));
  const data = JSON.stringify(safe);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>html,body,#map{height:100%;margin:0;padding:0;background:#e5e7eb;}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var markers = ${data};
    var map = L.map('map', { zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    var points = [];
    markers.forEach(function (m) {
      var mk = L.circleMarker([m.lat, m.lng], {
        radius: 9, color: '#ffffff', weight: 2, fillColor: m.color, fillOpacity: 0.95
      }).addTo(map);
      mk.bindPopup('<b>' + m.title + '</b><br/>' + m.status);
      points.push([m.lat, m.lng]);
    });
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
    } else {
      map.setView([39.0, 35.0], 5); // Türkiye geneli
    }
  </script>
</body>
</html>`;
}
