import { useState } from 'react';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/ui/submit-button';
import { useAuth } from '@/context/auth-context';

export default function Login() {
	const { login } = useAuth();

	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(identifier, password);
		} catch {
			toast.error('Invalid credentials');
		}
	};

	return (
		<main className="flex justify-center items-center h-svh">
			<form
				data-route={'https://ovdjejekosarkasve.com/api/auth/local'}
				onSubmit={handleSubmit}
				className="flex flex-col gap-2 "
			>
				<Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Email" />

				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>

				<SubmitButton isSubmitting={false} label="Login" />
			</form>
		</main>
	);
}
