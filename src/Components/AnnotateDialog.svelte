<script lang="ts">
	import Dialog, { Header, Title, Content } from '@smui/dialog';
	import Button, { Icon } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import axios from 'axios';
	import config from '../config';
	import ImageDisplay from './ImageDisplay.svelte';
	import LayoutGrid from '@smui/layout-grid';
	import Cell from '@smui/layout-grid/src/Cell.svelte';
	import { getDownloadUrl } from '../utils/async';
	import type { FileInfo } from '../utils/async';
	export let open = false;
	let curTask: Partial<Task> = {};
	let imgId = 0;
	let contentArray: string[] = [];
	let step = 0;

	const containerStyle = 'width: 80vw;';
	const style = 'max-width: 100vw;width: 100%;height: 90vh;';

	interface Task {
		ID?: number;
		Name: string;
		AuthorId: number;
		Content: string; // need JSON.parse to convert to an array
		CreateAt: string;
	}

	const getTasksAction = async () => {
		return (
			await axios.get<Partial<Task>[]>(config.apiBaseUrl + '/task', { withCredentials: true })
		).data;
	};

	const getDownloadUrlAction = async (info: FileInfo) => {
		return (await getDownloadUrl(info)).url;
	};

	const refreshSelectedTask = async (tasks: Partial<Task>[], ID: string) => {
		curTask = tasks.find((t) => t.ID?.toString() === ID) || {};
		contentArray = JSON.parse(curTask.Content || '[]');
		imgId = 0;
	};

	const getTasks = getTasksAction();
</script>

<Dialog bind:open container$style={containerStyle} surface$style={style}>
	<Header>
		<Title>创建新的标注</Title>
	</Header>
	<Content>
		{#if step === 0}
			<div>
				{#await getTasks then tasks}
					<Select
						class="task-sel"
						on:MDCSelect:change={(e) => refreshSelectedTask(tasks, e.detail.value)}
						label="选择一个标注任务"
					>
						{#each tasks as task}
							<Option value={task.ID?.toString()}>@{task.AuthorId} - {task.Name}</Option>
						{/each}
					</Select>

					<div class="subtitle">
						图片预览: {#if contentArray.length > 3}（仅显示前3张）{/if}
					</div>
					<LayoutGrid>
						{#each contentArray.slice(0, 3) as img}
							<Cell span={4}>
								{#await getDownloadUrlAction({ name: img, type: 'image/png' }) then url}
									<ImageDisplay {url} name={img} flag={false} switcher={() => ({})} />
								{/await}
							</Cell>
						{/each}
					</LayoutGrid>
					<Button
						on:click={() => (step = 1)}
						variant="raised"
						color="primary"
						class="next-step"
						disabled={curTask.ID === undefined}
					>
						开始标注！
					</Button>
				{/await}
			</div>
		{:else}
			<Button
				variant="outlined"
				color="primary"
				disabled={imgId <= 0}
				on:click={() => (imgId = imgId - 1)}
			>
				<Icon class="material-icons">arrow_back</Icon>
			</Button>
			<Button
				variant="outlined"
				color="primary"
				disabled={imgId >= contentArray.length - 1}
				on:click={() => (imgId = imgId + 1)}
			>
				<Icon class="material-icons">arrow_forward</Icon>
			</Button>
			{#if contentArray.length > 0}
				<span>{imgId + 1} / {contentArray.length}</span>
			{/if}
		{/if}
	</Content>
</Dialog>

<style>
	.subtitle {
		margin: 2rem 0;
		font-size: 1em;
		color: #333;
	}

	:global(.next-step) {
		position: absolute;
		bottom: 3rem;
		right: 5rem;
		width: 20%;
		height: 6%;
		font-weight: bolder;
		font-size: 1.5em;
	}

	:global(.task-sel) {
		width: 50%;
	}
</style>
