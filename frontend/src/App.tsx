import { Toaster } from 'react-hot-toast';

import Header from './components/header/header';
import AppRoutes from './components/routes/app-routes';

function App() {
	// console log env variables for debugging
	// console.log('Environment Variables:', {
	// 	REACT_APP_API_URL: process.env.REACT_APP_API_URL,
	// 	REACT_APP_OTHER_VAR: process.env.REACT_APP_OTHER_VAR
	// });

	console.log(import.meta.env);
	const path = import.meta.env.VITE_API_ROOT;
	const root = path ? path : 'https://www.ovdjejekosarkasve.com/api';

	console.log(`ROOT: ${root}`);

	return (
		<div>
			<Header />
			<AppRoutes />
			<Toaster position="bottom-right" />
		</div>
	);
}

export default App;
