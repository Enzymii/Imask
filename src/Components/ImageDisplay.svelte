<script lang="ts">
	import Card, { Content } from '@smui/card';

	export let url: string;
	export let name: string;
	export let flag: boolean;
	export let switcher: () => void;
</script>

<Card padded class="img" on:click={switcher}>
	<Content>
		{#if flag}
			<div class="badge" />
		{/if}
		<img src={url} alt={name} />
	</Content>
</Card>

<style>
	:global(.img) {
		width: 100%;
		height: 40vh;
		overflow: hidden;
		cursor: pointer;

		display: flex;
		text-align: center;
		justify-content: center;
	}

	:global(.img) img {
		width: 100%;
	}

	.badge {
		position: absolute;
		top: 0;
		right: 0;
		width: 0px;
		height: 0px;
		border-top: #ff3c00 solid 20px;
		border-right: #ff3c00 solid 20px;
		border-left: transparent solid 20px;
		border-bottom: transparent solid 20px;
	}
</style>
