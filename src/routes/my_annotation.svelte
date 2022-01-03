<script lang="ts">
	import axios from 'axios';
	import Button, { Icon } from '@smui/button/';
	import AnnotationList from '../Components/AnnotationList.svelte';
	import AnnotateDialog from '../Components/AnnotateDialog.svelte';
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

	const getAnnotation = async () =>
		(await axios.get<AnnoType[]>(config.apiBaseUrl + '/annotation', { withCredentials: true }))
			.data;

	interface TaskType {
		ID?: number;
		Name: string;
		AuthorId: string;
		Author: Record<string, string>;
		Content: string;
		CreatedAt: string;
	}

	const getTasksAction = async () =>
		(await axios.get<TaskType[]>(config.apiBaseUrl + '/task', { withCredentials: true })).data;
	const getTasks = getTasksAction();

	let open = false;
</script>

<div class="mdc-typography--headline3">我的标注</div>

<div class="button-group new">
	<Button class="btngrpbtn" variant="raised" color="primary" on:click={() => (open = true)}>
		<Icon class="material-icons">add</Icon>
		创建新的标注
	</Button>
</div>

{#await getTasks then tasks}
	{#await getAnnotation() then annotations}
		{#each annotations as annotation}
			<AnnotationList
				img={JSON.parse(tasks.find((task) => task.ID === annotation.TaskID)?.Content ?? '[]')}
				taskName={tasks.find((t) => t.ID === annotation.TaskID)?.Name ?? ''}
				anno={annotation}
				isJudging={false}
			/>
		{/each}
	{/await}

	<AnnotateDialog bind:open {tasks} />
{/await}

<style>
	:global(.new) {
		margin-top: 16px;
	}

	:global(.btngrpbtn) {
		margin-right: 8px;
	}
</style>
