import { Alert, Avatar, Dropdown, MenuProps, Space, Typography, theme } from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../context/AppProvider';
import { DomainTypes } from '../types/type';
import { TypographyText } from './typography';


const Icon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
      <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 15 15" height="35" viewBox="0 0 50 30" width="35">
            <path d="m0 0h32v32h-32z" fill="none" />
            <path d="m14 4h4v4h-4z" fill="#ffffff" />
            <path d="m4 4h4v4h-4z" fill="#ffffff" />
            <path d="m24 4h4v4h-4z" fill="#ffffff" />
            <path d="m14 14h4v4h-4z" fill="#ffffff" />
            <path d="m4 14h4v4h-4z" fill="#ffffff" />
            <path d="m24 14h4v4h-4z" fill="#ffffff" />
            <path d="m14 24h4v4h-4z" fill="#ffffff" />
            <path d="m4 24h4v4h-4z" fill="#ffffff" />
            <path d="m24 24h4v4h-4z" fill="#ffffff" />
      </svg>
);


const domain = [
      {
            label: 'SCM Integrations Demo',
            key: 'SCM',
      },
      {
            label: 'Ticketing Integrations Demo',
            key: 'BTS',
      }
]

const warningMsg = 'Access key not configured yet!';

const AppLogo = () => {
      return (
            <svg style={{ width: '30px' }} width="80" height="32" viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.987 31.5841C4.92849 31.5841 0 26.626 0 20.5323C0 14.4385 4.92899 9.48041 10.987 9.48041C17.045 9.48041 21.974 14.4385 21.974 20.5323C21.974 26.626 17.0459 31.5841 10.987 31.5841ZM10.987 10.536C5.50765 10.536 1.04938 15.0196 1.04938 20.5318C1.04938 26.044 5.50765 30.5275 10.987 30.5275C16.4663 30.5275 20.9251 26.0429 20.9251 20.5308C20.9251 15.0186 16.4673 10.536 10.987 10.536Z" fill="#2196f3"></path><path d="M18.96 21.0225C18.6182 19.7483 15.4851 19.6108 13.6203 20.0779C12.6437 20.3235 11.6456 20.6428 10.6162 20.8265C11.3697 21.4989 12.1788 22.135 13.34 22.2932C16.2211 22.6842 18.0112 21.775 18.96 21.0225Z" fill="#2196f3"></path><path d="M13.34 22.2932C12.1764 22.135 11.3697 21.4989 10.6162 20.8265C9.45013 19.7857 8.41298 18.6579 6.37723 19.0823C3.14069 19.7572 2.71488 23.6081 5.21404 26.0828C6.28706 27.2131 7.66455 28.0041 9.17779 28.3586C10.691 28.7132 12.2742 28.616 13.7333 28.079C15.1924 27.5419 16.4641 26.5883 17.3925 25.3352C18.3209 24.0819 18.8656 22.5835 18.96 21.0235C18.0112 21.775 16.221 22.6842 13.34 22.2932Z" fill="#673ab7"></path><path d="M15.034 13.9586C14.6301 14.8295 18.2304 15.7957 18.6611 18.6879C18.8687 15.8409 15.5335 12.882 15.034 13.9586Z" fill="#2196f3"></path><path d="M7.46619 17.5935C8.11524 17.3231 8.42345 16.5746 8.15463 15.9217C7.8858 15.2688 7.14167 14.9587 6.49262 15.2292C5.84357 15.4996 5.53536 16.2481 5.80418 16.9011C6.07306 17.5539 6.81714 17.8639 7.46619 17.5935Z" fill="#673ab7"></path><path d="M10.3549 14.08C10.6585 13.7746 10.6585 13.2795 10.3549 12.9741C10.0513 12.6687 9.55909 12.6687 9.25551 12.9741C8.95194 13.2795 8.95194 13.7746 9.25551 14.08C9.55909 14.3854 10.0513 14.3854 10.3549 14.08Z" fill="#2196f3"></path><path d="M13.1014 9.05206C14.2245 5.7149 13.4696 3.04871 11.1614 1.78241C9.58359 2.10513 8.647 2.87335 8.12549 3.93383C11.2204 3.68185 13.1844 5.63041 13.1014 9.05206Z" fill="#2196f3"></path><path d="M25.6983 6.13641C20.1389 4.1294 16.6304 4.81756 16.0786 9.39055C19.2648 12.6973 22.474 11.1146 25.6983 6.13641Z" fill="#2196f3"></path><path d="M21.2765 4.32541C21.5343 3.21728 21.6681 1.90776 21.6881 0.41748C15.9226 1.70883 13.3224 4.17658 15.2839 8.33846C15.3816 8.36203 15.4754 8.38119 15.5696 8.40085C16.0281 5.14422 18.0463 3.93835 21.2765 4.32541Z" fill="#2196f3"></path></svg>
      )
}

export const Header = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
      (props, ref) => {
            const { token: { colorPrimary } } = theme.useToken();
            const { setDomain, domain: selectedDomain, accessKey, userName, organization, appTitle } = React.useContext(AppContext)

            const items: MenuProps['items'] = domain.map(({ label, key }) => {
                  const selected = selectedDomain === key;
                  return {
                        label: <span style={{ color: selected ? colorPrimary : '' }} >{label}</span>,
                        key,
                        onClick: () => setDomain(key as DomainTypes)
                  }
            });

            return (
                  <div {...props} ref={ref}>
                        {!accessKey && <Alert message={warningMsg} banner closable />}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.8rem 1rem', background: 'black' }}>
                              <Space>
                                    <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']} arrow={{ pointAtCenter: true }}>
                                          <div style={{ cursor: 'pointer' }}>
                                                <Icon />
                                          </div>
                                    </Dropdown>
                                    <AppLogo />
                                    <TypographyText strong>
                                          {appTitle}
                                    </TypographyText>
                              </Space>
                              <Space>
                                    <Avatar style={{ backgroundColor: 'orange', verticalAlign: 'middle' }} size="large" >
                                          {userName?.charAt(0)}
                                    </Avatar>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }} >
                                          <Typography.Title level={5} style={{ color: 'white', margin: 0 }}>{userName}</Typography.Title>
                                          <TypographyText style={{ color: 'white' }}>{organization}</TypographyText>
                                    </div>
                              </Space>
                        </div>
                  </div>
            )
      })
