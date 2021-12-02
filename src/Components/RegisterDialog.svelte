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
	let email = '';
	let password = '';
	let confirmPassword = '';
	let fieldError = '';

	const handleRegister = () => {
		if (username.length < 6) {
			fieldError = '用户名长度不能小于6位';
			return;
		}
		const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if (!emailReg.test(email)) {
			fieldError = '用户名格式不正确';
			return;
		}
		if (password.length < 6) {
			fieldError = '密码长度不能小于6位';
			return;
		}
		if (password !== confirmPassword) {
			fieldError = '两次密码不一致';
			return;
		}
		fieldError = '';
		// TODO: 注册
		const fakeRegister = async (flag: boolean, msg: string) => {
			const res = await mockAsyncFunction({ username, password, email }, 500, { flag, msg });
			if (!res.flag) {
				fieldError = msg;
			}
		};

		fakeRegister(false, '用户名已经存在！');
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
				<TextField type="email" variant="outlined" bind:value={email} label={'邮箱'} class="txt" />
			</Cell>
			<Cell span={12}>
				<TextField
					variant="outlined"
					bind:value={password}
					type="password"
					label={'密码'}
					class="txt"
				/>
			</Cell>
			<Cell span={12}>
				<TextField
					variant="outlined"
					bind:value={confirmPassword}
					type="password"
					label={'确认密码'}
					class="txt"
				/>
			</Cell>
			<Cell span={12}>
				<Button variant="raised" on:click={handleRegister} class="btn">注册</Button>
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
