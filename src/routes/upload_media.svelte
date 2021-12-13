<script lang="ts">
	import { fly } from 'svelte/transition';

	import Button from '@smui/button/src/Button.svelte';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { Title } from '@smui/top-app-bar';
	import axios from 'axios';

	import ImageDisplay from '../Components/ImageDisplay.svelte';
	import VideoDisplay from '../Components/VideoDisplay.svelte';
	import VideoEditDialog from '../Components/VideoEditDialog.svelte';

	import config from '../config';
	import { uploadSingleFile } from '../utils/async';
	import type { FileInfo } from '../utils/async';
	import { setTargetVideo } from '../utils/store';

	const uploadAction = () => {
		if (filesToUpload.length === 0) {
			return;
		}

		Promise.all(filesToUpload.map(uploadSingleFile))
			.then(async (fileName) => {
				console.log('all uploaded');
				await axios.post(config.apiBaseUrl + '/uploaded', fileName, { withCredentials: true });
				filesToUpload = [];
				getMedia = getMediaAction();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getMediaAction = async () => {
		const { data: fileNameData } = await axios.get<FileInfo[]>(config.apiBaseUrl + '/collections', {
			withCredentials: true
		});

		const urls = await Promise.all(
			fileNameData.map(async ({ name }) => {
				return (
					await axios.get<{ url: string }>(config.apiBaseUrl + '/download_url', {
						params: { filename: name },
						withCredentials: true
					})
				).data;
			})
		);
		isChosenArray = new Array(urls.length).fill(false);
		return urls.map(({ url }, id) => ({ url, ...fileNameData[id] }));
	};

	let filesToUpload: File[] = [];
	let isChosenArray: boolean[] = [];
	let getMedia = getMediaAction();

	const onMediaUpload = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const files = e.currentTarget.files;
		if (!files) {
			return;
		}
		filesToUpload = [...Array.from(files)];
	};

	let hasChosen = false;
	const switchArray = (id: number) => {
		isChosenArray[id] = !isChosenArray[id];
		isChosenArray = [...isChosenArray];
		hasChosen = isChosenArray.some((item) => item);
	};

	const publishChosen = () => {
		// TODO: pop up a dialog to confirm
	};

	let onVideoEdit = false;
	const selectVideo = (video: HTMLVideoElement) => {
		setTargetVideo(video);
		// goto('/video_edit');
		onVideoEdit = true;
	};
</script>

<div>
	<div class="title-bar">
		<LayoutGrid>
			<Cell span={8}>
				<Title class="main-title">创建标注任务</Title>
			</Cell>
			<Cell span={4} class="align-right">
				<div class="upload">想添加新的图片/视频？</div>
				<input type="file" accept="image/*,video/*" multiple on:change={(e) => onMediaUpload(e)} />
				<Button class="upload-btn" disabled={filesToUpload.length === 0} on:click={uploadAction}
					>上传</Button
				>
			</Cell>
		</LayoutGrid>
	</div>
	<div class="sub-title-bar">
		<Title>图片列表</Title>
		<Button>创建标注任务</Button>
	</div>
	{#await getMedia}
		图片加载中...
	{:then medias}
		<LayoutGrid>
			{#each medias.filter(({ type }) => /^image/.test(type)) as media, id}
				<Cell span={4}>
					<ImageDisplay
						url={media.url}
						name={media.name}
						flag={isChosenArray[id]}
						switcher={() => switchArray(id)}
					/>
				</Cell>
			{/each}
		</LayoutGrid>
	{:catch err}
		<p>{err}</p>
	{/await}
	{#if hasChosen}
		<div class="bottom-banner" transition:fly={{ y: 50, duration: 500 }} on:click={publishChosen}>
			使用已选择的图片创建标注任务...
		</div>
	{/if}
	<div class="sub-title-bar">
		<Title>视频列表</Title>
		<p class="tips">Tips: 点击视频可以进入图片提取界面</p>
	</div>
	{#await getMedia}
		视频加载中...
	{:then medias}
		<LayoutGrid>
			{#each medias.filter(({ type }) => /^video/.test(type)) as media}
				<Cell span={4}>
					<VideoDisplay {...media} onClick={selectVideo} />
				</Cell>
			{/each}
		</LayoutGrid>
	{:catch err}
		<p>{err}</p>
	{/await}
</div>

<VideoEditDialog bind:open={onVideoEdit} />

<style>
	:global(.main-title) {
		font-size: 1.5em;
		font-weight: bolder;
	}

	.title-bar {
		margin-bottom: 1em;
	}

	.title-bar :global(.mdc-layout-grid) {
		width: 100%;
	}

	.title-bar,
	.sub-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	:global(.align-right) {
		text-align: right;
	}
	.tips {
		color: #999;
		max-width: 30vw;
	}

	.bottom-banner {
		z-index: 999;
		background-color: #ff3c00;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		font-size: 24px;
		text-align: center;
		line-height: 50px;
		color: #fff;
		cursor: pointer;
	}
</style>
