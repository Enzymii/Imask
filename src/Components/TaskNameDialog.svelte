<script lang="ts">
	import Dialog, { Header, Title, Content } from '@smui/dialog';
	import TextField from '@smui/textfield';
	import Button from '@smui/button';
	import axios from 'axios';
	import config from '../config';

	export let open = false;
	let taskName = '';
	export let imgs: string[] = [];

	const createTask = async () => {
		await axios.post(
			config.apiBaseUrl + '/task/create',
			{
				name: taskName,
				files: JSON.stringify(imgs)
			},
			{ withCredentials: true }
		);
		open = false;
	};
</script>

<Dialog bind:open>
	<Header>
		<Title>创建标注任务</Title>
	</Header>
	<Content class="flex">
		<TextField bind:value={taskName} label="任务名称" />
		<div class="hint">* 此任务包含{imgs.length}张图的标注</div>
		<div class="button-group">
			<Button on:click={() => ((open = false), (taskName = ''))}>取消</Button>
			<Button on:click={createTask}>确定</Button>
		</div>
	</Content>
</Dialog>

<style>
	:global(.flex) {
		display: flex;
		flex-direction: column;
	}

	.hint {
		margin: 2rem 0 1rem;
	}

	.button-group {
		display: flex;
		justify-content: end;
	}
</style>
