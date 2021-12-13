<script lang="ts">
	import Dialog from '@smui/dialog';
	import Slider from '@smui/slider';
	import Textfield from '@smui/textfield';

	import { targetVideo } from '../utils/store';

	export let open = false;
	let currentTime = 0;

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
			console.log('cb');
			ctx.drawImage(element, 0, 0, element.videoWidth, element.videoHeight);
			element.removeEventListener('seeked', callback);
		};
		element.addEventListener('seeked', callback);
		element.currentTime = pos;
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
	{element?.videoWidth}
	{element?.videoHeight}
</Dialog>
