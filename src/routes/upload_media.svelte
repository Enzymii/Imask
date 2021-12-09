<script lang="ts">
	import Button from '@smui/button/src/Button.svelte';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { Title } from '@smui/top-app-bar';
	import axios from 'axios';

	import ImageDisplay from '../Components/ImageDisplay.svelte';

	import config from '../config';
	import { uploadSingleFile } from '../utils/async';
	import type { FileInfo } from '../utils/async';

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
		console.log(urls, fileNameData);
		return urls.map(({ url }, id) => ({ url, ...fileNameData[id] }));
	};

	let filesToUpload: File[] = [];
	let getMedia = getMediaAction();

	const onMediaUpload = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const files = e.currentTarget.files;
		if (!files) {
			return;
		}
		filesToUpload = [...Array.from(files)];
	};
</script>

<div>
	<div class="title-bar">
		<Title class="main-title">创建标注任务</Title>
		<div class="upload">
			想添加新的图片/视频？
			<input
				type="file"
				accept="image/*,video/*"
				multiple
				on:change={(e) => onMediaUpload(e)}
			/><Button disabled={filesToUpload.length === 0} on:click={uploadAction}>上传</Button>
		</div>
	</div>
	<div class="sub-title-bar">
		<Title>图片列表</Title>
		<Button>创建标注任务</Button>
	</div>
	{#await getMedia}
		图片加载中...
	{:then medias}
		<LayoutGrid>
			{#each medias.filter(({ type }) => /^image/.test(type)) as media}
				<Cell span={4}>
					<ImageDisplay {...media} />
				</Cell>
			{/each}
		</LayoutGrid>
	{:catch err}
		<p>{err}</p>
	{/await}
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
					<ImageDisplay {...media} />
				</Cell>
			{/each}
		</LayoutGrid>
	{:catch err}
		<p>{err}</p>
	{/await}
</div>

<style>
	:global(.main-title) {
		font-size: 1.5em;
		font-weight: bolder;
	}

	.title-bar {
		margin-bottom: 1em;
	}

	.title-bar,
	.sub-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tips {
		color: #999;
	}
</style>
