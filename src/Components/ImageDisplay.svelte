<script lang="ts">
	import Card, { Content } from '@smui/card';

	export let url: string;
	export let name: string;
</script>

<Card padded class="img">
	<Content>
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
		justify-content: center;
	}

	:global(.img) img {
		width: 100%;
	}
</style>
