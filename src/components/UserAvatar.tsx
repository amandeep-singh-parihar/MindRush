import React from 'react';
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Image from 'next/image';

type Props = {
	user: Pick<User, 'name' | 'image'>;
};

const UserAvatar = ({ user }: Props) => {
	return (
		<Avatar>
			{user.image ? (
				<div className="relative w-10 h-10 rounded-full overflow-hidden">
					<AvatarImage
						src={user.image}
						alt="profile"
						referrerPolicy="no-referrer"
					/>
				</div>
			) : (
				<AvatarFallback>
					{user?.name?.charAt(0).toUpperCase() ?? '?'}
				</AvatarFallback>
			)}
		</Avatar>
	);
};

export default UserAvatar;
