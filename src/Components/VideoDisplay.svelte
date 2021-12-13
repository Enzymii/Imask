<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { Content } from '@smui/card';

	export let url: string;
	export let type: string;
	export let onClick: (video: HTMLVideoElement) => void;

	onMount(() => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.addEventListener('canplay', () => {
			video.play();
			console.log('canplay');
		});
	});

	const setVideo = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		onClick(video);
	};
</script>

<Card padded class="img">
	<Content on:click={setVideo}>
		<video muted loop id="video">
			<source src={url} {type} />
			<track kind="captions" />
		</video>
	</Content>
</Card>
