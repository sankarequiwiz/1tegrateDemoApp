import { Space, Typography } from "antd"

export const ProviderIndicator = ({ selectedService }) => {
   return (
      <Space direction='vertical' align='center'>
         <Space>
            <img src={selectedService?.serviceProfile?.image?.small} alt='provider_logo' />
         </Space>
         <Typography.Title level={4}>How would you like to authenticate?</Typography.Title>
      </Space>
   )
}