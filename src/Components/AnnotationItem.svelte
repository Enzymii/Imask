<script>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Annotorious } from '@recogito/annotorious';
	import Button from '@smui/button';
	import { annotation } from '../utils/store';

	export let imgUrl;
	export let show;
	export let id;
	let anno;
	let polygon = false;
	let ref;
	onMount(() => {
		anno = new Annotorious({ image: ref });
		anno.setDrawingTool('rect');

		const updateAnnotationStore = () => {
			console.log('aaaa');
			const newAnno = anno.getAnnotations();
			const tmp = [...$annotation];
			tmp[id] = newAnno;
			$annotation = tmp;
		};

		anno.on('createAnnotation', updateAnnotationStore);
		anno.on('updateAnnotation', updateAnnotationStore);
		anno.on('deleteAnnotation', updateAnnotationStore);
	});

	const toggleTool = () => {
		polygon = !polygon;
		anno.setDrawingTool(polygon ? 'polygon' : 'rect');
	};
</script>

<div class={show || 'hide'}>
	<div class="btn-group">
		<Button variant="raised" on:click={toggleTool}>
			{#if polygon}
				矩形选择
			{:else}
				多边形选择
			{/if}
		</Button>
		{#if polygon}
			<div class="tips">Tips：多边形选择时，在最后一个点使用双击以完成标注</div>
		{/if}
	</div>

	<div class="img-container">
		<img bind:this={ref} id="image" src={imgUrl} alt="Google" title="Google" />
	</div>
</div>

<style>
	.btn-group {
		margin-bottom: 2rem;
	}

	.img-container {
		width: 100%;
		height: 100%;
		background: #eee;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hide {
		display: none;
	}
</style>
