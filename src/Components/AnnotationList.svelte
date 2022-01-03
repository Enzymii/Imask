<script lang="ts">
	import { Icon } from '@smui/button';
	import Button from '@smui/button/src/Button.svelte';
	import Card from '@smui/card/src/Card.svelte';
	import axios from 'axios';
	import config from '../config';
	import { getDownloadUrl } from '../utils/async';
	import DisplayAnnotation from './DisplayAnnotation.svelte';

	import { toXml, toJson } from '../utils/export';

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

	export let isJudging: boolean;
	export let img: string[] = [];
	export let taskName: string;
	export let anno: AnnoType;

	let cur = 0;
	let show = false;

	const setAnnoStat = async (stat: 1 | 2) => {
		await axios.post(
			config.apiBaseUrl + '/annotation/status',
			{ id: anno.ID, stat },
			{ withCredentials: true }
		);
		anno.Status = stat;
	};

	const handleExport = (type: 'json' | 'coco' | 'xml') => {
		// coco and xml export is under development
		const element = document.createElement('a');
		switch (type) {
			case 'json':
				element.setAttribute(
					'href',
					`data:text/plain;charset=utf-8,${encodeURIComponent(anno.Json)}`
				);
				element.setAttribute('download', 'anno.json');
				break;
			case 'coco':
				element.setAttribute(
					'href',
					`data:text/plain;charset=utf-8,${encodeURIComponent(toJson(anno.Json))}`
				);
				element.setAttribute('download', 'anno.json');
				break;
			case 'xml':
				element.setAttribute(
					'href',
					`data:text/plain;charset=utf-8,${encodeURIComponent(toXml(anno.Json))}`
				);
				element.setAttribute('download', 'anno.xml');
				break;
		}
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		console.log(type, anno.Json);
	};

	let screenWidth: number;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<Card class="anno-card" on:click={() => (show = !show)}>
	<div class="anno-list">
		<div>#{anno.ID}</div>
		<div>
			<span class="sub-title">标注任务 </span>
			{taskName}
		</div>
		<div>
			<span class="sub-title">标注者 </span>
			{anno.AuthorId}
		</div>
		<div>
			<span class="sub-title">创建于 </span>
			{new Date(anno.CreatedAt).toLocaleString()}
		</div>
		<div class={anno.Status === 0 ? 'notime' : ''}>
			<span class="sub-title">复核于 </span>
			{new Date(anno.UpdatedAt).toLocaleString()}
		</div>
		<div>
			{#if anno.Status === 0}
				<Icon class="material-icons stat-wait">pending</Icon>
			{:else if anno.Status === 1}
				<Icon class="material-icons stat-pass">sentiment_satisfied_alt</Icon>
			{:else}
				<Icon class="material-icons stat-fail">sentiment_very_dissatisfied</Icon>
			{/if}
		</div>
	</div>
</Card>
{#if show}
	<div class="anno-canv">
		<div class={screenWidth > 700 ? 'slider' : 'slider-full'}>
			{#if screenWidth > 700}
				{#if cur === 0}
					<div class="none-pager" />
				{:else}
					<div class="pager prev" on:click={() => (cur = cur - 1)}>
						<Icon class="material-icons arrow prev-adj">arrow_back_ios</Icon>
					</div>
				{/if}
			{/if}
			{#each img as i, id}
				{#await getDownloadUrl({ name: i, type: 'image/png' }) then { url }}
					{#if id === cur}
						<DisplayAnnotation
							imgUrl={url}
							annotation={JSON.parse(anno.Json)[id]}
							altMsg={i}
						/>{/if}
				{/await}
			{/each}
			{#if screenWidth > 700}
				{#if cur === img.length - 1}
					<div class="none-pager" />
				{:else}
					<div class="pager next" on:click={() => (cur = cur + 1)}>
						<Icon class="material-icons arrow">arrow_forward_ios</Icon>
					</div>
				{/if}
			{/if}
		</div>
		{#if screenWidth > 700}
			<div class="panel">
				<div>
					Current: {cur + 1} / {img.length}
				</div>
				<div class="button-group">
					<div>
						<Button
							on:click={() => setAnnoStat(1)}
							disabled={!isJudging || anno.Status !== 0}
							variant="raised"
							color="primary"
						>
							通过
						</Button>
					</div>
					<div>
						<Button
							on:click={() => setAnnoStat(2)}
							disabled={!isJudging || anno.Status !== 0}
							variant="outlined"
							color="primary"
						>
							拒绝
						</Button>
					</div>
				</div>
				{#if anno.Status === 1}
					<div class="export-group">
						<Button on:click={() => handleExport('json')}>导出W3C JSON</Button>
						<Button on:click={() => handleExport('coco')}>导出COCO JSON</Button>
						<Button on:click={() => handleExport('xml')}>导出PASCAL VOC</Button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{#if screenWidth < 700}
		<div class="panel-mini">
			<span class={cur === 0 ? 'dis-b' : 'en-b'} on:click={() => (cur = cur === 0 ? cur : cur - 1)}>
				&lt;
			</span>
			{cur + 1} / {img.length}
			<span
				class={cur === img.length - 1 ? 'dis-b' : 'en-b'}
				on:click={() => (cur = cur + 1 === img.length ? cur : cur + 1)}
			>
				&gt;
			</span>

			<div>
				<Button
					disabled={!isJudging || anno.Status !== 0}
					variant="text"
					color="primary"
					on:click={() => setAnnoStat(1)}
				>
					通过
				</Button>
				<Button
					disabled={!isJudging || anno.Status !== 0}
					variant="text"
					color="secondary"
					on:click={() => setAnnoStat(2)}>拒绝</Button
				>
			</div>
		</div>
	{/if}
{/if}

<style>
	:global(.anno-card) {
		margin: 2rem;
		min-height: 80px;
		padding: 0 1rem;
		max-width: calc(100vw - 6rem);
		overflow-x: auto;
	}

	.anno-list {
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	.anno-list div {
		min-width: 32px;
	}

	.sub-title {
		color: #999;
	}

	.notime {
		opacity: 0;
	}

	:global(.stat-wait) {
		color: #999;
	}

	:global(.stat-pass) {
		color: #4caf50;
	}

	:global(.stat-fail) {
		color: #f44336;
	}

	.anno-canv {
		width: calc(100% - 4rem);
		height: 60vh;
		margin: 0 2rem;
		background-color: #e2e2e288;

		display: flex;
		justify-content: space-between;
		align-items: stretch;
	}

	.slider,
	.slider-full {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.slider {
		width: calc(100% - 244px);
	}

	.slider-full {
		width: 100%;
	}

	.panel {
		width: 244px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		background-color: #fff;
	}

	.panel * {
		margin: 1rem;
	}

	.button-group {
		display: flex;
	}

	.export-group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pager {
		height: 100%;
		background: #ddd;
		display: flex;
		justify-content: center;
		align-items: center;

		text-align: center;
		color: #fff;
		width: 44px;
		vertical-align: center;

		opacity: 0;
	}
	.pager:hover {
		opacity: 1;
		cursor: pointer;
	}

	.none-pager {
		opacity: 0;
		width: 44px;
	}

	.pager :global(.prev-adj) {
		transform: translateX(10px);
	}

	.pager :global(.arrow) {
		font-size: 44px;
	}

	.panel-mini {
		width: calc(100vw - 4rem);
		line-height: 36px;
		display: flex;
		justify-content: space-between;
	}
	.dis-b {
		opacity: 0;
	}
</style>
