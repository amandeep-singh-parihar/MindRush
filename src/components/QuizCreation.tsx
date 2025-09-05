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

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
	const form = useForm<Input>({
		resolver: zodResolver(quizCreationSchema),
		defaultValues: {
			amount: 1,
			topic: '',
			type: 'open_ended',
		},
	});

	function onSubmit(input: Input) {
		console.log(input);
		alert(JSON.stringify(input, null, 2));
	}

	form.watch();

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
							<Button type="submit" className="cursor-pointer">
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
