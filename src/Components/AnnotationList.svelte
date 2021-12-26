<script lang="ts">
	import { getDownloadUrl } from '../utils/async';
	import DisplayAnnotation from './DisplayAnnotation.svelte';

	interface AnnoType {
		ID: number;
		TaskID: number;
		AuthorId: string;
		Author: Record<string, string>;
		Json: string;
		Status: number;
		CreatedAt: string;
		UpdatedAt: string;
	}

	export let img: string[] = [];
	export let taskName: string;
	export let anno: AnnoType;

	let cur = 0;
	let show = false;
</script>

<div class="anno-list" on:click={() => (show = !show)}>
	<div>#{anno.ID}</div>
	<div>标注任务：{taskName}</div>
	<div>标注者：{anno.AuthorId}</div>
	<div>创建于：{new Date(anno.CreatedAt)}</div>
	<div>
		{#if anno.Status != 0}
			复核于：{new Date(anno.UpdatedAt)}
		{/if}
	</div>
	<div>
		{#if anno.Status === 0}
			待复核
		{:else if anno.Status === 1}
			复核通过
		{:else}
			复核被拒
		{/if}
	</div>
</div>
{#if show}
	{#each img as i, id}
		{#if id === cur}
			{#await getDownloadUrl({ name: i, type: 'image/png' }) then { url }}
				<DisplayAnnotation imgUrl={url} annotation={JSON.parse(anno.Json)[id]} altMsg={i} />
			{/await}
		{/if}
	{/each}
{/if}
