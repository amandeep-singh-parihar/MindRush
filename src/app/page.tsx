import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { getDbSession } from '@/lib/auth0-db';
import { redirect } from 'next/navigation';

export default async function Home() {
	// Check if user is authenticated using the official Auth0 SDK
	const session = await getDbSession();

	if (session?.user) {
		// user is logged in
		return redirect('/dashboard');
	}

	return (
		<div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
			<Card className="w-[300px] border-2 border-[#e6e8ed] shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-linear">
				<CardHeader>
					<CardTitle>Welcome to MindRush !!!</CardTitle>
					<CardDescription>
						MindRush is your personal AI-powered quiz generator. Create custom
						quizzes in seconds, sharpen your knowledge, and learn smarter every
						day.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{/* Redirects to Auth0 to log in */}
					<a 
						href="/auth/login" 
						className="flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
					>
						Sign In with Auth0
					</a>
					{/* Redirects to Auth0 to sign up */}
					<a 
						href="/auth/login?screen_hint=signup" 
						className="flex items-center justify-center rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-black hover:bg-zinc-50 transition-colors"
					>
						Sign Up
					</a>
				</CardContent>
			</Card>
		</div>
	);
}
