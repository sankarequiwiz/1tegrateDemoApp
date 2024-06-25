import {
  Alert,
  Avatar,
  Dropdown,
  MenuProps,
  Space,
  Typography,
  theme,
} from 'antd';
import React, { HTMLProps } from 'react';
import { AppContext } from '../context/AppProvider';
import { DomainTypes } from '../types/type';

import { TypographyText } from './typography';
import { Notification } from './Notification';

import userAvatar from '../assets/avatar.png';
import brandLogo from '../assets/brandBlue.svg';
import Events from '../utils/Events';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 15 15"
    height="35"
    viewBox="0 0 50 30"
    width="35"
  >
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
    label: 'Source Control',
    key: 'SCM',
  },
  {
    label: 'Ticketing',
    key: 'TICKETING',
  },
  {
    label: 'Packages & Container registry',
    value: 'CONTAINER_REGISTRY',
    disabled: true,
  },
  {
    label: 'Notifications & Communications',
    value: 'Notifications & Communications',
    disabled: true,
  },
  {
    value: 'VULNERABILITY MANAGEMENT',
    label: 'Vulnerability management',
    disabled: true,
  },
  {
    value: 'INCIDENT MANAGEMENT',
    label: 'Incident Management',
    disabled: true,
  },
  {
    value: 'SIEM',
    label: 'SIEM',
    disabled: true,
  },
  {
    value: 'EDR AND XDR',
    label: 'EDR & XDR',
    disabled: true,
  },
  {
    value: 'FILE STORAGE AND CONTENT MANAGEMENT',
    label: 'File storage & Content management',
    disabled: true,
  },
  {
    value: 'CRM',
    label: 'CRM',
    disabled: true,
  },
  {
    value: 'HR AND BENEFITS',
    label: 'HR & Benefits',
    disabled: true,
  },
  {
    value: 'MARKETING',
    label: 'Marketing',
    disabled: true,
  },
  {
    value: 'ACCOUNTING AND ERP',
    disabled: true,
    label: 'Accounting & ERP',
  }
];

const warningMsg =
  'Warning: Access key not configured yet. Please configure the access key to proceed.';

export const Header = React.forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>((props, ref) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const {
    setDomain,
    domain: selectedDomain,
    accessKey,
    userName,
    organization,
    appTitle,
  } = React.useContext(AppContext);

  const items: MenuProps['items'] = domain.map(({ label, key, ...rest }) => {
    const selected = selectedDomain === key;
    return {
      label: (
        <span style={{ color: selected ? colorPrimary : '' }}>{label}</span>
      ),
      key,
      onClick: () => {
        setDomain(key as DomainTypes)
        Events.trigger('event:update_domain', {});
      },
      ...rest,
    };
  });

  return (
    <div {...props} ref={ref}>
      {!accessKey && <Alert type="error" message={warningMsg} banner />}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '.8rem 1rem',
          background: 'black',
        }}
      >
        <Space>
          <Dropdown
            menu={{ items }}
            placement="bottomLeft"
            trigger={['click']}
            arrow={{ pointAtCenter: true }}
          >
            <div style={{ cursor: 'pointer' }}>
              <Icon />
            </div>
          </Dropdown>
          <img width={23} alt="brand_logo" src={brandLogo} />
          <TypographyText strong>{appTitle}</TypographyText>
        </Space>

        <Space>
          <Space>
            <Notification style={{ marginRight: '1rem' }} />
          </Space>
          <Space>
            <Avatar
              src={userAvatar}
              style={{ backgroundColor: 'orange', verticalAlign: 'middle' }}
              size="large"
            >
              {userName?.charAt(0)}
            </Avatar>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}
            >
              <Typography.Title level={5} style={{ color: 'white', margin: 0 }}>
                {userName}
              </Typography.Title>
              <Typography.Text style={{ color: 'white' }}>
                {organization}
              </Typography.Text>
            </div>
          </Space>
        </Space>
      </div>
    </div>
  );
});
