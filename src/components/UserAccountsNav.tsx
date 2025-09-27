'use client';
import React from 'react';
import { User } from 'next-auth';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

type Props = {
	user: Pick<User, 'name' | 'image' | 'email'>;
};

const UserAccountsNav = ({ user }: Props) => {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="cursor-pointer">
				<UserAvatar user={user} />
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="bg-popover text-popover-foreground border-none p-2 rounded-md mt-2 shadow-xl"
				align="end"
			>
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-1 leading-none">
						{user.name && <p className="font-medium">{user.name}</p>}
						{user.email && (
							<p className="w-[200px] truncate text-sm text-muted-foreground">
								{user.email}
							</p>
						)}
					</div>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="px-2 hover:bg-accent hover:text-accent-foreground">
					<Link href="/">BACK</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={(e) => {
						e.preventDefault();
						signOut().catch(console.error);
					}}
					className="text-red-600 cursor-pointer px-2 flex items-center justify-start hover:bg-zinc-100 dark:hover:bg-zinc-800"
				>
					Sign Out
					<LogOut className="w-4 h-4 ml-2" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccountsNav;
