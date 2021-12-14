<script lang="ts">
	import config from '../config';
	import { goto } from '$app/navigation';

	import Button from '@smui/button';
	import Dialog from '@smui/dialog';
	import Slider from '@smui/slider';
	import Textfield from '@smui/textfield';

	import axios from 'axios';

	import { nanoid } from 'nanoid';
	import { uploadSingleFile } from '../utils/async';
	import { targetVideo } from '../utils/store';

	export let open = false;
	let currentTime = 0;
	let blobs: File[] = [];

	let element: HTMLVideoElement | null = null;
	let sliderProps = { min: 0, max: 0.001, step: 0.001 };
	targetVideo.subscribe((video) => {
		element = video;
		if (!video) return;
		sliderProps = { ...sliderProps, ...{ max: video.duration > 0 ? video.duration : 0.001 } };
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
			}, 'image/jpeg');
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

<Dialog bind:open scrimClickAction="">
	<canvas id="canv" width={element?.videoWidth} height={element?.videoHeight}>
		你的浏览器不支持canvas, 请更换浏览器
	</canvas>
	<Textfield bind:value={currentTime} input$readonly variant="outlined" type="number" />
	<Slider
		bind:value={currentTime}
		{...sliderProps}
		on:MDCSlider:input={() => extractFrame(currentTime)}
	/>
	<Button on:click={cropImage}>选这帧</Button>
	<Button on:click={uploadImages}>上传</Button>
	{#each blobs as blob}
		<img src={URL.createObjectURL(blob)} alt={nanoid()} />
	{/each}
</Dialog>
