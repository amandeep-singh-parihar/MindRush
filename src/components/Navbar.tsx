import React from 'react';
import { getAuthSession } from '@/lib/nextauth';
import Link from 'next/link';
import SignInButton from './SignInButton';
import UserAccountsNav from './UserAccountsNav';
import ThemeToggle from './ThemeToggle';
import blacklogo from '../../public/mindrush-high-resolution-logo-transparent.png';
import whitelogo from '../../public/mindrush-high-resolution-logo-transparent-white.png';

type Props = {};

const Navbar = async (props: Props) => {
	const session = await getAuthSession();
	// console.log(session?.user);
	return (
		<div className="fixed inset-x-0 top-0 bg-[#faf8f5] dark:bg-[#000] z-[10] h-fit border-b border-[#c2cad1] py-3">
			<div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
				{/* logo */}
				<Link href="/" className="flex items-center gap-2">
					<p className="rounded-lg border-2 border-b-5 border-r-4  border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
						<img
							src={blacklogo.src}
							alt="Mindrush logo"
							width={100}
							height={40}
							className="block dark:hidden"
						/>
						<img
							src={whitelogo.src}
							alt="Mindrush logo"
							width={100}
							height={40}
							className="hidden dark:block"
						/>
					</p>
				</Link>

				<div className="flex items-center">
					<ThemeToggle className="mr-4" />

					<div className="flex items-center">
						{session?.user ? (
							<UserAccountsNav user={session.user} />
						) : (
							<SignInButton text="Sign In" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
