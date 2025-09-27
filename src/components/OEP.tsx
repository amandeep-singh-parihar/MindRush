'use client';
import React from 'react';
import { Game, Question } from '@prisma/client';
import { BarChart, Timer } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import BlankAnswerInput from './BlankAnswerInput';
import Link from 'next/link';
// import { useTheme } from 'next-themes';

type Props = {
	game: Game & { questions: Pick<Question, 'id' | 'answer' | 'question'>[] };
};

const OEP = ({ game }: Props) => {
	const [questionIndex, setQuestionIndex] = React.useState(0);
	const [blankAnswer, setBlankAnswer] = React.useState<string>('');
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

	// console.log(currentQuestion.answer);

	const { mutate: checkAnswer, isPending: isChecking } = useMutation({
		mutationFn: async () => {
			let filledAnswer = blankAnswer;
			document.querySelectorAll('#user_blank_input').forEach((input) => {
				filledAnswer = filledAnswer.replace('_____', input.value);
				input.value = '';
			});
			const payload: z.infer<typeof checkAnswerSchema> = {
				questionId: currentQuestion.id,
				userAnswer: filledAnswer,
			};
			const response = await axios.post('/api/checkAnswer', payload);
			return response.data;
		},
	});

	const handleNext = React.useCallback(() => {
		if (isChecking) return;

		// console.log(blankAnswer);

		checkAnswer(undefined, {
			onSuccess: ({ percentageMatch }) => {
				toast(`Your answer is ${Math.round(percentageMatch * 100)}% correct`);

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
			if (e.key === 'Enter') {
				handleNext();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleNext]);

	// const {theme} = useTheme();

	if (hasEnded) {
		return (
			<div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div
					className={`px-4 py-2 mt-2 font-semibold bg-[#e6ff78] text-[#292929] rounded-md whitespace-nowrap`}
				>
					Quiz Ended! You Complete in{' '}
					{`${formatTime(differenceInSeconds(now, game.timeStarted))}`}.
				</div>
				<Link
					href={`/statistics/${game.id}`}
					className="flex items-center justify-center px-4 py-2 mt-4 font-semibold text-white bg-[#292929] rounded-md whitespace-nowrap hover:bg-[#292929c1] transition-colors"
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
			</div>

			<Card className="w-full mt-4 border-none">
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
				<BlankAnswerInput
					answer={currentQuestion?.answer}
					setBlankAnswer={setBlankAnswer}
				/>

				<Button
					className="mt-2 cursor-pointer"
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

export default OEP;
