<script lang="ts">
	import config from '../config';
	import { goto } from '$app/navigation';

	import Button from '@smui/button';
	import Dialog, { Content, Title, Header } from '@smui/dialog';
	import Slider from '@smui/slider';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import IconButton from '@smui/icon-button';

	import axios from 'axios';

	import { uploadSingleFile } from '../utils/async';
	import { targetVideo } from '../utils/store';
	import ImageDisplay from './ImageDisplay.svelte';

	export let open = false;
	let currentTime = 0;
	$: currentTimeFixed = currentTime.toFixed(2);
	let blobs: File[] = [];

	const timeLag = 0.01;

	let element: HTMLVideoElement | null = null;
	let sliderProps = { min: 0, max: timeLag, step: timeLag };
	targetVideo.subscribe((video) => {
		element = video;
		if (!video) return;
		sliderProps = { ...sliderProps, ...{ max: video.duration > 0 ? video.duration : timeLag } };
	});

	const extractFrame = (pos: number) => {
		console.log('extractFrame', pos);
		if (!element) {
			return;
		}
		const callback = () => {
			const ctx = (document.getElementById('canv') as HTMLCanvasElement).getContext('2d');
			if (!ctx || !element) {
				console.error('Could not get canvas context');
				return;
			}
			ctx.drawImage(element, 0, 0, element.videoWidth, element.videoHeight);
			element.removeEventListener('seeked', callback);
		};
		element.addEventListener('seeked', callback);
		element.currentTime = pos;
	};

	const cropImage = async () =>
		new Promise<void>((resolve) => {
			const canvas = document.getElementById('canv') as HTMLCanvasElement;
			canvas.toBlob(async (blob) => {
				console.log('awwa');
				if (!blob) {
					console.error('Could not get blob');
					return;
				}
				blobs = [...blobs, blob as File];
				resolve();
			}, 'image/png');
		});

	const uploadImages = async () => {
		try {
			const res = await Promise.all(blobs.map(uploadSingleFile));
			await axios.post(config.apiBaseUrl + '/uploaded', res, { withCredentials: true });
			open = false;
			goto('/upload_media');
		} catch (e) {
			console.error(e);
		}
	};
</script>

<Dialog bind:open surface$style={'min-width: 50vw'} scrimClickAction="">
	<Header class="header">
		<Title>视频帧提取</Title>
		<IconButton class="material-icons" on:click={() => (open = false)}>close</IconButton>
	</Header>
	<Content>
		<LayoutGrid>
			<Cell span={9}>
				<div class="canvas-container">
					<canvas id="canv" width={element?.videoWidth} height={element?.videoHeight}>
						你的浏览器不支持canvas, 请更换浏览器
					</canvas>
				</div>
				<div class="tool-bar">
					<div class="tool-bar-ctrl">
						<input class="tool-bar-inp" bind:value={currentTimeFixed} readonly />
						<Slider
							bind:value={currentTime}
							{...sliderProps}
							style={'min-width: 240px'}
							on:MDCSlider:input={() => extractFrame(currentTime)}
						/>
					</div>
					<div>
						<Button variant="text" on:click={cropImage}>选这帧</Button>
						<Button variant="raised" color="primary" on:click={uploadImages}>上传</Button>
					</div>
				</div>
			</Cell>
			<Cell class="img-list" span={3}>
				{#each blobs as blob, id}
					<!-- <img src={URL.createObjectURL(blob)} alt={`video-capture${id}.png`} /> -->
					<ImageDisplay
						url={URL.createObjectURL(blob)}
						name={`video-capture${id}.png`}
						flag={false}
						switcher={() => undefined}
					/>
				{/each}
			</Cell>
		</LayoutGrid>
	</Content>
</Dialog>

<style>
	:global(.header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.canvas-container {
		position: relative;
		width: calc(100% - 30px);
		max-height: 60vh;
		background-color: #e5e5e5aa;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	.tool-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tool-bar-ctrl {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tool-bar-inp {
		width: 7ch;
		text-align: center;
	}

	:global(.img-list) {
		max-height: 70vh;
		overflow-y: scroll;
	}

	:global(.img-list .img) {
		width: calc(100% - 10px);
		height: 20vh;
		margin-bottom: 5px;
	}
</style>
