'use client';
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

type Props = {};

const ThemeToggle = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	return (
		<div className={className} {...props}>
			<Button
				variant="outline"
				size="icon"
				className="rounded-full border-0 cursor-pointer relative"
				onClick={toggleTheme}
			>
				<Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:scale-0 dark:-rotate-90" />

				<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

				<span className="sr-only">Toggle theme</span>
			</Button>
		</div>
	);
};

export default ThemeToggle;
