<script lang="ts">
	import Button, { Icon } from '@smui/button/';
	import AnnotateDialog from '../Components/AnnotateDialog.svelte';

	import AnnotationItem from '../Components/AnnotationItem.svelte';
</script>

<Button variant="raised" color="primary">
	<Icon class="material-icons">add</Icon>
	创建新的标注
</Button>

<AnnotateDialog open={true} />
