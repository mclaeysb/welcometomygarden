<script>
  import { setContext, onMount } from 'svelte';
  import maplibregl from 'maplibre-gl';
  import key from './mapbox-context.js';

  import 'maplibre-gl/dist/maplibre-gl.css';

  export let lat;
  export let lon;
  export let zoom;
  export let applyZoom = false; // make this true if the provided zoom level should be applied
  export let recenterOnUpdate = false;
  export let initialLat = lat;
  export let initialLon = lon;
  export let jump = false;

  let container;
  let map;
  let loaded = false;

  setContext(key, {
    getMap: () => map
  });

  maplibregl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  onMount(() => {
    map = new maplibregl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [lon, lat],
      zoom,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    map.addControl(new maplibregl.ScaleControl());
    map.addControl(new maplibregl.AttributionControl({ compact: false }));

    map.on('load', () => {
      loaded = true;
    });
  });

  $: if (map) {
    map.jumpTo({
      center: [initialLon, initialLat]
    });
  }

  $: if (recenterOnUpdate && map && initialLat !== lat && initialLon !== lon) {
    const zoomLevel = applyZoom ? zoom : map.getZoom();
    const params = { center: [lon, lat], zoom: zoomLevel };
    if (!jump) {
      map.flyTo({
        ...params,
        bearing: 0,
        speed: 1,
        curve: 1,
        essential: true
      });
    } else {
      map.jumpTo(params);
    }
  }
</script>

<div bind:this={container}>
  {#if map && loaded}
    <slot />
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
