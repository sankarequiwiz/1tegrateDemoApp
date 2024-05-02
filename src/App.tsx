import { ConfigProvider } from 'antd';
import './app.scss';
import { AppProvider } from './context/AppProvider';
import { Main } from './containers/main';

import { BrowserRouter } from 'react-router-dom';
import { StepProvider } from './context/StepCompProvider';


function Root() {
  return (
    <BrowserRouter>
      <StepProvider>
        <AppProvider>
          <ConfigProvider theme={{ token: { borderRadius: 2 } }}>
            <Main />
          </ConfigProvider>
        </AppProvider>
      </StepProvider>
    </BrowserRouter>
  )
}

export default Root
