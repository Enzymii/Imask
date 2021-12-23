<script>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Annotorious } from '@recogito/annotorious';
	import Button from '@smui/button';

	let polygon = false;
	let anno;
	onMount(() => {
		anno = new Annotorious({ image: 'image' });
		anno.setDrawingTool('rect');
	});

	const toggleTool = () => {
		polygon = !polygon;
		anno.setDrawingTool(polygon ? 'polygon' : 'rect');
	};
</script>

<div>
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
		<img
			id="image"
			src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
			alt="Google"
			title="Google"
		/>
	</div>

	<Button on:click={() => console.log(anno.getAnnotations())}>完成</Button>
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
</style>
