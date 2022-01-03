<script lang="ts">
	import TopAppBar, {
		Row,
		Section,
		Title,
		AutoAdjust,
		TopAppBarComponentDev
	} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import { mdiAccountPlus, mdiLogin, mdiLogout } from '@mdi/js';

	import LoginDialog from '../Components/LoginDialog.svelte';
	import { loggedIn, setLoggedIn } from '../utils/store';
	import RegisterDialog from '../Components/RegisterDialog.svelte';
	import axios from 'axios';
	import config from '../config';
	import RouterDrawer from '../Components/RouterDrawer.svelte';

	let topAppBar: TopAppBarComponentDev;

	// let lightTheme =
	// 	typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
	// function switchTheme() {
	// 	lightTheme = !lightTheme;
	// 	let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
	// 	if (!themeLink) {
	// 		themeLink = document.createElement('link');
	// 		themeLink.rel = 'stylesheet';
	// 		themeLink.id = 'theme';
	// 	}
	// 	themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
	// 	document.head
	// 		.querySelector<HTMLLinkElement>('link[href="/smui-dark.css"]')
	// 		?.insertAdjacentElement('afterend', themeLink);
	// }

	let icon = mdiLogout;
	let isLoggedIn = '';
	loggedIn.subscribe((loggedIn) => {
		icon = loggedIn ? mdiLogin : mdiLogout;
		isLoggedIn = loggedIn;
	});
	let loginDialogOpen = false;
	let registerDialogOpen = false;

	const autoLoginAction = async (): Promise<string> => {
		const { data } = await axios.get(config.apiBaseUrl + '/status', { withCredentials: true });

		if (data.username.length > 0) {
			setLoggedIn(data.username);
		}
		return data.username;
	};

	let autoLogin = autoLoginAction();

	const handleLoginClick = () => {
		if (!isLoggedIn) {
			loginDialogOpen = true;
		} else {
			setLoggedIn('');
		}
	};

	const handleRegisterClick = () => (registerDialogOpen = true);

	let drawerOpen = false;
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<IconButton class="material-icons" on:click={() => (drawerOpen = true)}>list</IconButton>
			<Title>Imask</Title>
		</Section>
		<Section align="end" toolbar>
			{#await autoLogin then username}
				{#if isLoggedIn.length > 0}
					{isLoggedIn.slice(0, 1)}
				{/if}
			{/await}
			{#if isLoggedIn.length < 1}
				<IconButton on:click={handleRegisterClick}>
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiAccountPlus} />
					</Icon>
				</IconButton>
			{/if}
			<IconButton on:click={handleLoginClick}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={icon} />
				</Icon>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>

<RouterDrawer bind:open={drawerOpen} />

<AutoAdjust {topAppBar} style="display: flex; justify-content: space-between;">
	<div class="container"><slot /></div>
	<!-- <div class="container">
		<Button on:click={switchTheme}>
			<Label>{lightTheme ? 'Lights off' : 'Lights on'}</Label>
		</Button>
	</div> -->
</AutoAdjust>

<LoginDialog bind:open={loginDialogOpen} />
<RegisterDialog bind:open={registerDialogOpen} />

<style>
	.container {
		width: 100vw;
	}
</style>
