import { Space, Typography } from "antd"

export const ProviderIndicator = ({ selectedService, onlyLogo = false, title: titleProp = null }) => {

   const title = titleProp || 'How would you like to authenticate?';

   return (
      <Space direction='vertical' align='center'>
         <Space>
            <img src={selectedService?.serviceProfile?.image?.small} alt='provider_logo' />
         </Space>
         {!onlyLogo ? (
            <Typography.Title level={4}>{title}</Typography.Title>
         ) : null}
      </Space>
   )
}