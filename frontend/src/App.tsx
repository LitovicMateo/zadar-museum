import { Toaster } from 'react-hot-toast';

import Header from './components/header/Header';
import AppRoutes from './components/routes/AppRoutes';

import './App.css';

function App() {
	const env = import.meta.env;
	console.log(env); // For debugging purposes only
	return (
		<div className="app-root">
			<Header />
			<div className="app-content">
				<AppRoutes />
			</div>
			<Toaster position="bottom-right" />
		</div>
	);
}

export default App;
