import { ConfigProvider } from 'antd';

import './app.scss';
import './assets/styles/main.css';
import './assets/styles/responsive.css';

import { AppProvider } from './context/AppProvider';
import { Main } from './containers/main';

import { BrowserRouter } from 'react-router-dom';
import { StepProvider } from './context/StepCompProvider';
import { WatchEventsProvider } from './context/WatchContext';


function Root() {
  return (
    <BrowserRouter>
      <WatchEventsProvider>
        <StepProvider>
          <AppProvider>
            <ConfigProvider theme={{ token: { borderRadius: 2 } }}>
              <Main />
            </ConfigProvider>
          </AppProvider>
        </StepProvider>
      </WatchEventsProvider>
    </BrowserRouter>
  )
}

export default Root
