<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
import {songs} from '$lib/data/songs'
import {scaleLinear} from 'd3-scale'
import * as THREE from 'three';
import * as SC from 'svelte-cubed';
	import Page from '../+page.svelte';
	import { text } from 'svelte/internal';

const songArray = Object.entries(songs).map(s=> ({
 id: s[1].id,
  title:s[1].name,
  mainArtist: s[1].artists,
  valence: s[1].valence,
  danceability: s[1].danceability,
  energy: s[1].energy,
  popularity: s[1].popularity,
  tempo: s[1].tempo,
  previewUrl: s[1].preview_url
}))
let showXRange = true
let showYRange = true
let showZRange = true
let showRRange = true

let xRangeDenominator = 1
let yRangeDenominator = 1
let zRangeDenominator = 1
let rRangeDenominator = 1

const xScale = scaleLinear().domain([0,1]).range([-5,5])
const yScale = scaleLinear().domain([0,1]).range([-5,5])
const zScale = scaleLinear().domain([0,1]).range([-5,5])
const rScale = scaleLinear().domain([0,100]).range([.05,.3])

const happyDanceyCrazy = songArray.filter(s=> s.danceability >= .5 && s.valence >= .5 && s.energy >= .5)
const happyNoRhythmCrazy = songArray.filter(s=> s.danceability < .5 && s.valence >= .5 && s.energy >= .5)
const happyDanceyCalm = songArray.filter(s=> s.danceability >= .5 && s.valence >= .5 && s.energy < .5)
const happyNoRhythmCalm = songArray.filter(s=> s.danceability < .5 && s.valence >= .5 && s.energy < .5)

const sadDanceyCrazy = songArray.filter(s=> s.danceability >= .5 && s.valence < .5 && s.energy >= .5)
const sadNoRhythmCrazy = songArray.filter(s=> s.danceability < .5 && s.valence < .5 && s.energy >= .5)
const sadDanceyCalm = songArray.filter(s=> s.danceability >= .5 && s.valence < .5 && s.energy < .5)
const sadNoRhythmCalm = songArray.filter(s=> s.danceability < .5 && s.valence < .5 && s.energy < .5)

const labels= [
  {text:'Happy',coords:[0,5,0]},
  {text:'Sad',coords:[0,-5,0]},
  {text:'Dancey',coords:[0,0,5]},
  {text:'Stand-Still',coords:[0,0,-5]},
  {text:'Energetic',coords:[5,0,0]},
  {text:'Calm',coords:[-5,0,0]},
]

SC.onFrame(()=>{
  if (xRangeDenominator < 5 && !showXRange)
  {xRangeDenominator += .1}
  if (xRangeDenominator > 1 && showXRange){
    xRangeDenominator -= .1
  } 
  if (yRangeDenominator < 5 && !showYRange)
  {yRangeDenominator += .1}
  if (yRangeDenominator > 1 && showYRange){
    yRangeDenominator -= .1
  } 
  if (zRangeDenominator < 5 && !showZRange)
  {zRangeDenominator += .1}
  if (zRangeDenominator > 1 && showZRange){
    zRangeDenominator -= .1
  } 
  if (rRangeDenominator < 5 && !showRRange)
  {rRangeDenominator += .1}
  if (rRangeDenominator > 1 && showRRange){
    rRangeDenominator -= .1
  } 
})


</script>


<SC.Canvas antialias background={new THREE.Color('papayawhip')} shadows>
  <SC.Primitive
    object={new THREE.GridHelper(10, 10, 0x444444, 0xaaaaaa)}
    position={[0, yScale(.5), 0]}
    rotation={[-Math.PI/2, 0,0]}
    />
    <SC.Primitive
    object={new THREE.GridHelper(10, 10, 0x444444, 0xaaaaaa)}
    position={[xScale(.5), 0, 0]}
    rotation={[0,0,-Math.PI/2]}
  />
  <SC.Primitive
    object={new THREE.GridHelper(10, 10, 0x444444, 0xaaaaaa)}
    position={[0, 0, zScale(.5)]}
  />
  <!-- <SC.Primitive 
    object={new THREE.Line3(new THREE.Vector3(-5,0,-5),new THREE.Vector3(5,0,5))}
  /> -->
  {#each songArray as song}
  <SC.Group 
    position={[
      xScale.range([-5/xRangeDenominator,5/xRangeDenominator])(song.energy), 
      yScale.range([-5/yRangeDenominator,5/yRangeDenominator])(song.valence), 
      zScale.range([-5/zRangeDenominator,5/zRangeDenominator])(song.danceability)
    ]}>
    <SC.Mesh 
      geometry={new THREE.SphereGeometry(rScale.range([.05/rRangeDenominator,.3/rRangeDenominator])(song.popularity),32,16)} 
      material={new THREE.MeshStandardMaterial({ color: 0xff3e00 })} 
    />
  </SC.Group>
  {/each}
  {#each labels as label}
  <SC.Mesh 
    geometry={new THREE.SphereGeometry(1,32,16)}
    position={label.coords}
  />
  {/each}
	<SC.PerspectiveCamera position={[12.5, 12.5, 12.5]} />
  <SC.OrbitControls enableZoom={true}/>
  <SC.AmbientLight intensity={0.6} />
  <SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }}/>
</SC.Canvas>

<div class="controls">
  <label><input type='checkbox'bind:checked={showXRange}/> Measure Energy</label>
  <label><input type='checkbox'bind:checked={showYRange}/> Measure Happiness</label>
  <label><input type='checkbox'bind:checked={showZRange}/> Measure Danceability</label>
  <h2>Happy, Dancey & Energetic: {happyDanceyCrazy.length} songs</h2>
  <h2>Happy, Dancey & Calm: {happyDanceyCalm.length} songs</h2>
  <h2>Happy, Lazy & Energetic: {happyNoRhythmCrazy.length} songs</h2>
  <h2>Happy, Lazy & Calm: {happyNoRhythmCalm.length} songs</h2>
  <h2>Sad, Dancey & Energetic: {sadDanceyCrazy.length} songs</h2>
  <h2>Sad, Dancey & Calm: {sadDanceyCalm.length} songs</h2>
  <h2>Sad, Lazy & Energetic: {sadNoRhythmCrazy.length} songs</h2>
  <h2>Sad, Lazy & Calm: {sadNoRhythmCalm.length} songs</h2>
</div>
  
  <style>
  	.controls {
  		position: absolute;
  	}
  </style>