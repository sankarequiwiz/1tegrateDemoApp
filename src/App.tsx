import { ConfigProvider } from 'antd';

import './app.scss';
import './assets/styles/main.css';
import './assets/styles/responsive.css';

import { AppContext, AppProvider } from './context/AppProvider';
import { Main } from './containers/main';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StepProvider } from './context/StepCompProvider';
import { WatchEventsProvider } from './context/WatchContext';
import { Fragment } from 'react/jsx-runtime';
import { Header } from './components/Header';
import { Events } from './containers/events';
import { useContext, useEffect } from 'react';
import services from './services';

function Root() {
	return (
		<BrowserRouter>
			<WatchEventsProvider>
				<StepProvider>
					<AppProvider>
						<ConfigProvider theme={{ token: { borderRadius: 2 } }}>
							<App />
						</ConfigProvider>
					</AppProvider>
				</StepProvider>
			</WatchEventsProvider>
		</BrowserRouter>
	);
}

function App() {
   const { setAccessKey } = useContext(AppContext)

	const getAccessKey = async () => {
		try {
			const { data } = await services.services.getAccessKey();
			setAccessKey(data);
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getAccessKey();
	}, [])

	return (
		<Fragment>
			<Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 2 }} />
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/events" element={<Events />} />
			</Routes>
		</Fragment>
	);
}

export default Root;
