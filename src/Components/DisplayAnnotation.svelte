<script>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-nocheck

	import { Annotorious } from '@recogito/annotorious';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let imgUrl;
	export let altMsg;
	export let annotation;
	let ref;
	let anno;

	onMount(async () => {
		// const myAnno = JSON.parse(annotation);
		anno = new Annotorious({ image: ref, readOnly: true });
		anno.setAnnotations(annotation);
	});
</script>

<div transition:slide>
	<img bind:this={ref} src={imgUrl} alt={altMsg} />
</div>

<style>
	img {
		max-width: calc(100vw - 6rem);
	}
</style>