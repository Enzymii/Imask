<script lang="ts">
	import Button from '@smui/button/';
	import Dialog, { Header, Content, Title } from '@smui/dialog';
	import TextField from '@smui/textfield';
	import Grid, { Cell } from '@smui/layout-grid';
	import IconButton from '@smui/icon-button';

	import { setLoggedIn } from '../utils/store';
	import mockAsyncFunction from '../utils/async';

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
		const fakeLogin = async (flag: boolean, msg: string) => {
			const res = await mockAsyncFunction({ username, password }, 500, { flag, msg });
			if (res.flag) {
				setLoggedIn(true);
				open = false;
			} else {
				fieldError = res.msg;
			}
		};

		fakeLogin(true, '登录成功');
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
