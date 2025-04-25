<script>
	let username = '';
	let password = '';

	async function login() {
		const res = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify({ username, password, type: 'login' })
		});
		const data = await res.json();
		if (data.success) {
			alert('Logged in!');
			window.location.href = '/dashboard';
		} else {
			alert(data.error);
		}
	}
</script>

<h1>Login</h1>
<input bind:value={username} placeholder="Username" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={login}>Login</button>
