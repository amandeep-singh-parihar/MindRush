import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import SignInButton from '@/components/SignInButton';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
export default async function Home() {
	const session = await getAuthSession();
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
				<CardContent>
					<SignInButton text="Sign In with Google!" />
				</CardContent>
			</Card>
		</div>
	);
}
