<script lang="ts">
	import Button from '@smui/button/';
	import Dialog, { Header, Content, Title } from '@smui/dialog';
	import TextField from '@smui/textfield';
	import Grid, { Cell } from '@smui/layout-grid';
	import IconButton from '@smui/icon-button';

	import { setLoggedIn } from '../utils/store';
	import axios from 'axios';
	import config from '../config';

	export let open = false;
	let username = '';
	let password = '';
	let fieldError = '';

	const handleLogin = () => {
		if (username.length < 1) {
			fieldError = '请输入用户名';
			return;
		}
		if (password.length < 1) {
			fieldError = '请输入密码';
			return;
		}
		fieldError = '';
		// TODO: login
		axios
			.post(config.apiBaseUrl + '/login', {
				username: username,
				password: password
			})
			.then(() => {
				setLoggedIn(true);
				open = false;
			})
			.catch(() => {
				fieldError = '登录失败，可能是用户名或密码错误';
			});
	};
</script>

<Dialog bind:open scrimClickAction="">
	<Header>
		<Title class="dlg-title">登录</Title>
		<IconButton class="material-icons btn-close" on:click={() => (open = false)}>close</IconButton>
	</Header>
	<Content>
		<Grid>
			<Cell span={12}>
				<TextField variant="outlined" bind:value={username} label={'用户名'} class="txt" />
			</Cell>
			<Cell span={12}>
				<TextField
					variant="outlined"
					type="password"
					bind:value={password}
					label={'密码'}
					class="txt"
				/>
			</Cell>
			<Cell span={12}>
				<Button variant="raised" on:click={handleLogin} class="btn">登录</Button>
			</Cell>
			<Cell span={12}><span class="field-err">{fieldError}</span></Cell>
		</Grid>
	</Content>
</Dialog>

<style>
	.field-err {
		color: red;
	}

	:global(.btn-close) {
		position: absolute;
		right: 10px;
		top: 10px;
	}

	:global(.btn),
	:global(.txt) {
		width: 100%;
	}
</style>
