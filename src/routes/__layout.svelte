<script lang="ts">
	import Button from '@smui/button';
	import TopAppBar, {
		Row,
		Section,
		Title,
		AutoAdjust,
		TopAppBarComponentDev
	} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { Label, Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import { mdiAccountPlus, mdiLogin, mdiLogout } from '@mdi/js';

	import LoginDialog from '../Components/LoginDialog.svelte';
	import { loggedIn, setLoggedIn } from '../utils/store';
	import RegisterDialog from '../Components/RegisterDialog.svelte';
	import axios from 'axios';
	import config from '../config';

	let topAppBar: TopAppBarComponentDev;

	let lightTheme =
		typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
	function switchTheme() {
		lightTheme = !lightTheme;
		let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
		if (!themeLink) {
			themeLink = document.createElement('link');
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
		document.head
			.querySelector<HTMLLinkElement>('link[href="/smui-dark.css"]')
			?.insertAdjacentElement('afterend', themeLink);
	}

	let icon = mdiLogout;
	let isLoggedIn = false;
	loggedIn.subscribe((loggedIn) => {
		icon = loggedIn ? mdiLogin : mdiLogout;
		isLoggedIn = loggedIn;
	});
	let loginDialogOpen = false;
	let registerDialogOpen = false;

	const autoLoginAction = async (): Promise<string> => {
		const { data } = await axios.get(config.apiBaseUrl + '/status', { withCredentials: true });

		if (data.username.length > 0) {
			setLoggedIn(true);
		}
		return data.username;
	};

	let autoLogin = autoLoginAction();

	const handleLoginClick = () => {
		if (!isLoggedIn) {
			loginDialogOpen = true;
		} else {
			setLoggedIn(false);
		}
	};

	const handleRegisterClick = () => (registerDialogOpen = true);
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section><Title>Imask</Title></Section>
		<Section align="end" toolbar>
			{#await autoLogin then username}
				{#if !isLoggedIn}
					<IconButton on:click={handleRegisterClick}>
						<Icon component={Svg} viewBox="0 0 24 24">
							<path fill="currentColor" d={mdiAccountPlus} />
						</Icon>
					</IconButton>
				{:else}
					{username.slice(0, 1)}
				{/if}

				<IconButton on:click={handleLoginClick}>
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={icon} />
					</Icon>
				</IconButton>
			{/await}
		</Section>
	</Row>
</TopAppBar>

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
