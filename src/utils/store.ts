import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const setLoggedIn = (value: boolean) => {
	loggedIn.set(value);
};
