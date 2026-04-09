import { Toaster } from 'react-hot-toast';

import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';

import './App.css';

function App() {
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
