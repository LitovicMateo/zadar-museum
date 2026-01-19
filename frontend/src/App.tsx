import { Toaster } from 'react-hot-toast';

import Header from './components/header/header';
import AppRoutes from './components/routes/app-routes';

function App() {
	return (
		<div>
			<Header />
			<AppRoutes />
			<Toaster position="bottom-right" />
		</div>
	);
}

export default App;
