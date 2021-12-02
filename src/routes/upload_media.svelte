<script lang="ts">
	import { Title } from '@smui/top-app-bar';

	const onMediaUpload = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const files = e.currentTarget.files;
		if (!files) {
			return;
		}
		// TODO: upload files to OSS
	};

	interface MediaResource {
		url: string;
		type: string;
	}

	let medias: MediaResource[] = [];
</script>

<div>
	<Title>上传图片/视频</Title>
	<input type="file" accept="image/* video/*" multiple on:change={(e) => onMediaUpload(e)} />
	<Title>我的图片/视频</Title>
	{#each medias as media}
		{#if media.type === 'image'}
			<img src={media.url} alt={media.url} />
		{:else}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video src={media.url} controls />
		{/if}
	{/each}
</div>
