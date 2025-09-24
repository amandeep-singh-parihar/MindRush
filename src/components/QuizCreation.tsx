'use client';
import React from 'react';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardContent,
} from './ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { quizCreationSchema } from '@/schemas/form/quiz';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CopyCheck, BookOpen } from 'lucide-react';
import { Separator } from './ui/separator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingQuestions from './LoadingQuestions';

type Props = {
	topicParam: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topicParam }: Props) => {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [finished, setFinished] = React.useState(false);
	const { mutate: getQuestions, isPending } = useMutation({
		mutationFn: async ({ amount, topic, type }: Input) => {
			const response = await axios.post('/api/game', {
				amount,
				topic,
				type,
			});
			return response.data;
		},
		onError: () => {
			toast.error(
				'The AI is taking a coffee break ☕ — try again and it should work!',
			);
		},
	});
	const form = useForm<Input>({
		resolver: zodResolver(quizCreationSchema),
		defaultValues: {
			amount: 1,
			topic: topicParam,
			type: 'open_ended',
		},
	});

	function onSubmit(input: Input) {
		setLoading(true);
		// console.log(input);
		getQuestions(
			{
				amount: input.amount,
				topic: input.topic,
				type: input.type,
			},
			{
				onSuccess: ({ gameId }) => {
					setFinished(true);
					setTimeout(() => {
						if (form.getValues('type') === 'open_ended') {
							router.push(`/play/open-ended/${gameId}`);
						} else {
							router.push(`/play/multiple-choice/${gameId}`);
						}
					}, 1000);
				},
				onError: () => {
					setLoading(false);
				},
			},
		);
	}

	form.watch();
	if (loading) {
		return <LoadingQuestions finished={finished} />;
	}

	return (
		<div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
			<Card className="w-96 border-1 border-zinc-300 shadow-lg">
				<CardHeader>
					<CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
					<CardDescription>Choose a topic</CardDescription>
				</CardHeader>
				<CardContent>
					<FormProvider {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="topic"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<FormControl>
											<Input placeholder="Enter a topic..." {...field} />
										</FormControl>
										<FormDescription>
											Please provide a topic for the quiz.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Questions</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												max={10}
												placeholder="Enter the amount of questions..."
												{...field}
												onChange={(e) => {
													form.setValue('amount', parseInt(e.target.value));
												}}
											/>
										</FormControl>
										<FormDescription>
											Please provide a topic for the quiz.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-between">
								<Button
									type="button"
									className="w-1/2 rounded-r-none cursor-pointer"
									variant={
										form.getValues('type') === 'multiple_choice'
											? 'default'
											: 'secondary'
									}
									onClick={() => form.setValue('type', 'multiple_choice')}
								>
									<CopyCheck className="h-4 w-4 mr-2" />
									Multiple Choice
								</Button>
								<Separator orientation="vertical" className="" />
								<Button
									type="button"
									className="w-1/2 rounded-l-none cursor-pointer"
									variant={
										form.getValues('type') === 'open_ended'
											? 'default'
											: 'secondary'
									}
									onClick={() => form.setValue('type', 'open_ended')}
								>
									<BookOpen className="h-4 w-4 mr-2" /> Open Ended
								</Button>
							</div>
							<Button
								disabled={isPending}
								type="submit"
								className="cursor-pointer"
							>
								Submit
							</Button>
						</form>
					</FormProvider>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuizCreation;
