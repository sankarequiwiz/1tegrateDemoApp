import { Space, Typography } from "antd"

export const ProviderIndicator = ({ selectedService, onlyLogo = false }) => {
   return (
      <Space direction='vertical' align='center'>
         <Space>
            <img src={selectedService?.serviceProfile?.image?.small} alt='provider_logo' />
         </Space>
         {!onlyLogo ? (
            <Typography.Title level={4}>How would you like to authenticate?</Typography.Title>
         ) : null}
      </Space>
   )
}