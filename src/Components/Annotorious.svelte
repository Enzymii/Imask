<script>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-nocheck

	import Annotorious from '@recogito/annotorious';

	export let img;

	const anno = new Annotorious({
		element: document.getElementById('img'),
		img,
		onSelection: (annotation) => {
			console.log(annotation);
		}
	});
</script>

Annotorious!
<img id="marker" src={img} alt={img} />
