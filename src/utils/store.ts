import { writable } from 'svelte/store';

export const loggedIn = writable(false);
export const setLoggedIn = (value: boolean) => {
	loggedIn.set(value);
};

export const targetVideo = writable<HTMLVideoElement | null>(null);
export const setTargetVideo = (value: HTMLVideoElement) => {
	targetVideo.set(value);
};
