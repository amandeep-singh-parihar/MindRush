'use client';
import React from 'react';
import Image from 'next/image';
import { Progress } from './ui/progress';

type Props = {
	finished: boolean;
};

const loadingTexts = [
	'Generating questions...',
	'Unleashing knowledge...',
	'Fueling your brain power...',
	'Unlocking next-level insights...',
	'Sharpening your skills...',
	'Loading awesomeness...',
	'Boosting your learning journey...',
	'Preparing something epic...',
	'Igniting your curiosity...',
	'Leveling up your mind...',
	'Getting ready to conquer...',
];

const LoadingQuestions = ({ finished }: Props) => {
	const [progress, setProgress] = React.useState(0);
	const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);
	React.useEffect(() => {
		const interval = setInterval(() => {
			const rIdx = Math.floor(Math.random() * loadingTexts.length);
			setLoadingText(loadingTexts[rIdx]);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (finished) return 100;
				if (prev === 100) {
					return 0;
				}
				if (Math.random() < 0.1) {
					return prev + 2;
				}
				return prev + 0.5;
			});
		}, 100);
		return () => clearInterval(interval);
	}, [finished]);
	return (
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
			<Image
				src={'/loading.gif'}
				width={550}
				height={550}
				alt="loading animation"
			/>
			<Progress value={progress} className="w-full mt-4" />
			<h2 className="mt-2 text-xl">{loadingText}</h2>
		</div>
	);
};

export default LoadingQuestions;
