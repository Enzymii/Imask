import { writable } from 'svelte/store';

export const loggedIn = writable('');
export const setLoggedIn = (value: string) => {
	loggedIn.set(value);
};

export const targetVideo = writable<HTMLVideoElement | null>(null);
export const setTargetVideo = (value: HTMLVideoElement) => {
	targetVideo.set(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const annotation = writable<any[]>([]);
