import { useState } from 'react';
import toast from 'react-hot-toast';

import { Input } from '@/components/UI/Input';
import SubmitButton from '@/components/UI/SubmitButton';
import { useAuth } from '@/context/AuthContext';

import styles from '@/components/Login/Login.module.css';

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
		<main className={styles.page}>
			<form onSubmit={handleSubmit} className={styles.form}>
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
