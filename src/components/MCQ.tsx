'use client';
import { Game, Question } from '@prisma/client';
import React, { use } from 'react';
import { Timer, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { set, z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { BarChart } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { differenceInSeconds, parseISO } from 'date-fns';

type Props = {
	game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
};

const MCQ = ({ game }: Props) => {
	const [questionIndex, setQuestionIndex] = React.useState(0);
	const [seletedChoice, setSeletedChoice] = React.useState<number>(0);
	const [correctAnswers, setCorrectAnswers] = React.useState(0);
	const [wrongAnswers, setWrongAnswers] = React.useState(0);
	const [hasEnded, setHasEnded] = React.useState(false);
	const [now, setNow] = React.useState(new Date());

	React.useEffect(() => {
		const interval = setInterval(() => {
			if (!hasEnded) {
				setNow(new Date());
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [hasEnded]);

	const currentQuestion = React.useMemo(() => {
		return game.questions[questionIndex];
	}, [questionIndex, game.questions]);

	const { mutate: checkAnswer, isPending: isChecking } = useMutation({
		mutationFn: async () => {
			const payload: z.infer<typeof checkAnswerSchema> = {
				questionId: currentQuestion.id,
				userAnswer: options[seletedChoice],
			};
			const response = await axios.post('/api/checkAnswer', payload);
			return response.data;
		},
	});

	const handleNext = React.useCallback(() => {
		if (isChecking) return;
		checkAnswer(undefined, {
			onSuccess: ({ isCorrect }) => {
				if (isCorrect) {
					toast.success('Correct Answer');
					setCorrectAnswers((prev) => prev + 1);
				} else {
					toast.error('Wrong Answer');
					setWrongAnswers((prev) => prev + 1);
				}
				if (questionIndex === game.questions.length - 1) {
					setHasEnded(true);
					toast('Quiz ended! Check your results on the next screen');
					return;
				}
				setQuestionIndex((prev) => prev + 1);
			},
		});
	}, [checkAnswer, toast, isChecking, questionIndex, game.questions.length]);

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '1') {
				setSeletedChoice(0);
			} else if (e.key === '2') {
				setSeletedChoice(1);
			} else if (e.key === '3') {
				setSeletedChoice(2);
			} else if (e.key === '4') {
				setSeletedChoice(3);
			} else if (e.key === 'Enter') {
				handleNext();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleNext]);

	const options = React.useMemo(() => {
		if (!currentQuestion) return [];
		if (!currentQuestion.options) return [];
		return JSON.parse(currentQuestion.options as string) as string[];
	}, [currentQuestion]);

	if (hasEnded) {
		return (
			<div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="px-4 py-2 mt-2 font-semibold text-white bg-green-600 rounded-md whitespace-nowrap">
					Quiz Ended! You Complete in{' '}
					{`${formatTime(differenceInSeconds(now, game.timeStarted))}`}.
				</div>
				<Link
					href={`/statistics/${game.id}`}
					className="flex items-center justify-center px-4 py-2 mt-4 font-semibold text-white bg-slate-900 rounded-md whitespace-nowrap hover:bg-slate-700 transition-colors"
				>
					View Statistics
					<BarChart className="w-4 h-4 ml-2" />
				</Link>
			</div>
		);
	}

	return (
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] mt-8">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<p>
						<span className="text-slate-400 mr-2">Topic</span>
						<span className="px-2 py-1 text-white rounded-lg bg-zinc-900 capitalize">
							{game.topic}
						</span>
					</p>
					<div className="flex self-start mt-3 text-slate-400">
						<Timer className="mr-2" />
						{formatTime(differenceInSeconds(now, game.timeStarted))}
					</div>
				</div>
				<MCQCounter
					correctAnswers={correctAnswers}
					wrongAnswers={wrongAnswers}
				/>
			</div>

			<Card className="w-full mt-4">
				<CardHeader className="flex flex-row items-center">
					<CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
						<div>{questionIndex + 1}</div>
						<div className="text-base text-slate-400">
							{game.questions.length}
						</div>
					</CardTitle>
					<CardDescription className="flex-grow text-lg">
						{currentQuestion?.question}
					</CardDescription>
				</CardHeader>
			</Card>

			<div className="flex flex-col items-center justify-center w-full mt-4">
				{options.map((option, idx) => {
					return (
						<Button
							key={idx}
							className="justify-start w-full py-8 mb-4 cursor-pointer"
							variant={seletedChoice === idx ? 'default' : 'secondary'}
							onClick={() => setSeletedChoice(idx)}
						>
							<div className="flex items-center justify-start">
								<div className="p-2 px-3 mr-5 border rounded-md">{idx + 1}</div>
								<div className="text-start">{option}</div>
							</div>
						</Button>
					);
				})}
				<Button
					className="mt-2"
					onClick={() => handleNext()}
					disabled={isChecking}
				>
					{isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
					Next <ChevronRight className="w-4 h-4 ml-2" />
				</Button>
			</div>
		</div>
	);
};

export default MCQ;
