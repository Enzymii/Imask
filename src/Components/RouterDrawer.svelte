<script lang="ts">
	import Drawer, { Header, Content } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import IconButton from '@smui/icon-button/src/IconButton.svelte';
	import { goto } from '$app/navigation';

	export let open: boolean;
</script>

<Drawer variant="modal" fixed={false} bind:open>
	<Header class="qwq">
		<IconButton class="material-icons" on:click={() => (open = false)}>close</IconButton>
	</Header>
	<Content>
		<List>
			<Item on:click={() => goto('/')}>首页</Item>
			<Item on:click={() => goto('/upload_media')}>我的资源</Item>
			<Item on:click={() => goto('/my_tasks')}>我的任务</Item>
			<Item on:click={() => goto('/my_annotation')}>我的标注</Item>
		</List>
	</Content>
</Drawer>

<style>
	:global(.qwq) {
		text-align: right;
	}
</style>
