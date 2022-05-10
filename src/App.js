import React, { useRef, useEffect, useLocation } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = 'pk.eyJ1Ijoia25nZW5vMDgiLCJhIjoiY2wyenoxa3NjMGg2cDNjbDc3eWJjOHhldyJ9.p9tbVbNMRLfVHTmY43tBIw';
 
export default function App() {
const mapContainer = useRef(null);
const map = useRef(null);
const [lng, setLng] = useLocation(46.0012);
const [lat, setLat] = useLocation(5.5322);
const [zoom, setZoom] = useLocation(5);

const year = document.getElementById('selectYear').value;
const month = document.getElementById('selectMonth').value;
const tenday = document.getElementById('selectTenDay').value;

const servermap="mukau";
const version="1.1.1";
const layers="cdi_chirps";
const SELECTED_YEAR=year;
const SELECTED_MONTH=month;
const SELECTED_TENDAYS=tenday;
 
useEffect(() => {
if (map.current) return; // initialize map only once
map.current = new mapboxgl.Map({
container: mapContainer.current,
style: 'mapbox://styles/mapbox/streets-v11',
center: [lng, lat],
zoom: zoom
});
});
 
useEffect(() => {
if (!map.current) return; // wait for map to initialize
map.current.on('move', () => {
setLng(map.current.getCenter().lng.toFixed(4));
setLat(map.current.getCenter().lat.toFixed(4));
setZoom(map.current.getZoom().toFixed(2));
});
});

useEffect(() => {
    if (!map.current) return; 
    map.addLayer({
        id: "admin-layer",
        type: "vector",
        source: {
        type: "vector",
        tiles: [
            "https://eahazardswatch.icpac.net/pg/tileserv/pgadapter.ea_gadm36_political_boundaries/{z}/{x}/{y}.pbf"
        ],
        tileSize: 256
        },
        paint: {}
    });

    map.addSource('wms-test-source', {
    'type': 'raster',
    // use the tiles option to specify a WMS tile source URL
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
    'tiles': [
        'https://droughtwatch.icpac.net/mapserver/mukau/php/gis/mswms.php&SERVICE=WMS&VERSION='+version+'&REQUEST=GetMap&LAYERS='+layers+'&STYLES=&SRS=EPSG:4326&BBOX=-173.537,35.8775,-11.9603,83.8009&WIDTH=400&HEIGHT=300&FORMAT=image/png'
    ],
    'tileSize': 256
    });
    map.addLayer(
    {
    'id': 'wms-test-layer',
    'type': 'raster',
    'source': 'wms-test-source',
    'paint': {}
    },
    'aeroway-line'
    );
});
return (
<div>
<div className="sidebar">
Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
</div>
<div ref={mapContainer} className="map-container" />
</div>
);
}