import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds - hours * 3600) / 60);
	const secs = Math.floor(seconds - hours * 3600 - mins * 60);
	const parts = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (mins > 0) parts.push(`${mins}m`);
	if (secs > 0) parts.push(`${secs}s`);
	return parts.join(' ');
}
