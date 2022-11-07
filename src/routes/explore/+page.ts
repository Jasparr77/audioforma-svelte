// import { writable } from 'svelte/store';
// import { json } from '@sveltejs/kit';

// export async function load({ fetch }) {
// 	console.log('...loading Songs');

// 	const songs = writable({});

// 	const songFetch = json(
// 		await fetch('https://audioforma.firebaseio.com/publicTrackData.json', {
// 			method: 'GET'
// 		})
// 	);

// 	if (songFetch.status === 200) {
// 		songs.set(songFetch.json);
// 		return songs;
// 	}
// }
