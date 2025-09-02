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

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
	const form = useForm<Input>({
		resolver: zodResolver(quizCreationSchema),
		defaultValues: {
			amount: 3,
			topic: '',
			type: 'open_ended',
		},
	});

	function onSubmit(data: Input) {
		console.log(data);
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
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="shadcn" {...field} />
										</FormControl>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Submit</Button>
						</form>
					</FormProvider>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuizCreation;
