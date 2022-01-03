<script lang="ts">
	import Card from '@smui/card/src/Card.svelte';
	import axios from 'axios';
	import AnnotationList from '../Components/AnnotationList.svelte';
	import config from '../config';

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

	const getAnnotation = async (id: number) =>
		(
			await axios.get<AnnoType[]>(config.apiBaseUrl + '/annotation', {
				params: { task: id },
				withCredentials: true
			})
		).data;

	interface TaskType {
		ID: number;
		Name: string;
		AuthorId: string;
		Author: Record<string, string>;
		Content: string;
		CreatedAt: string;
	}

	const getTasksAction = async () => {
		const res = (
			await axios.get<TaskType[]>(config.apiBaseUrl + '/task/my', { withCredentials: true })
		).data;
		display = new Array(res.length).fill(false);
		return res;
	};
	const getTasks = getTasksAction();

	let display: boolean[] = [];
</script>

<div class="mdc-typography--headline3">我的任务</div>

{#await getTasks then tasks}
	{#each tasks as task, id}
		<Card
			class="task-card"
			on:click={() => {
				const tmp = [...display];
				tmp[id] = !tmp[id];
				display = tmp;
			}}
		>
			<div class="task-list">
				<div>#{task.ID}</div>
				<div>{task.Name}</div>
				<div>创建于：{new Date(task.CreatedAt).toLocaleString()}</div>
				<div>共{JSON.parse(task.Content).length}张图片</div>
			</div>
		</Card>
		{#if display[id]}
			{#await getAnnotation(task.ID) then annotations}
				<div class="info-txt">
					共{annotations.length}条标注，
					{annotations.filter((anno) => anno.Status === 0).length}条待复核，
					{annotations.filter((anno) => anno.Status === 1).length}条复核通过，
					{annotations.filter((anno) => anno.Status === 2).length}条复核不通过
				</div>
				{#each annotations as annotation}
					<AnnotationList
						img={JSON.parse(task.Content || '[]')}
						taskName={task.Name}
						anno={annotation}
						isJudging={true}
					/>
				{/each}
			{/await}
		{/if}
	{/each}
{/await}

<style>
	:global(.task-card) {
		min-height: 80px;
		padding: 0 1rem;
		margin: 2rem 0;
		width: calc(100vw - 4rem);
	}

	.task-list {
		height: 80px;
		line-height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.task-list * {
		min-width: 24px;
	}

	.info-txt {
		margin-left: 1rem;
		max-width: 80vh;
	}
</style>
