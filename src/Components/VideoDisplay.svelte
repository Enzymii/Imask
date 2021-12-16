<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { Content } from '@smui/card';
import { nanoid } from 'nanoid';

	export let url: string;
	export let type: string;
	export let onClick: (video: HTMLVideoElement) => void;

	const videoId = nanoid();

	onMount(() => {
		const video = document.getElementById(videoId) as HTMLVideoElement;
		video.addEventListener('canplay', () => {
			video.play();
			console.log('canplay');
		});
	});

	const setVideo = () => {
		const video = document.getElementById(videoId) as HTMLVideoElement;
		onClick(video);
	};
</script>

<Card padded class="img">
	<Content on:click={setVideo}>
		<video muted loop id={videoId} crossorigin="anonymous">
			<source src={url} {type} />
			<track kind="captions" />
		</video>
	</Content>
</Card>
