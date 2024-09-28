import { Button, Flex, Modal, ModalProps, Result, Skeleton, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import services from "../../../../services";
import { useServiceConfigTypeProvider } from "../../../../context/serviceConfig.context";
import { useAppProvider } from "../../../../context/AppProvider";
import { ProviderIndicator } from "./providerIndicator";

type ConfirmationModalProps = {
} & ModalProps

const getSuccessUrl = () => {
   let successUrl = new URL(window.location.href),
      params = new URLSearchParams(successUrl.search);

   params.set('current', '1'); // Replace 'key' with your parameter name and 'value' with your desired value

   successUrl.search = params.toString();

   return successUrl.href;
}, getFailureUrl = () => {
   const url = window.location.href;
   return url;
}

const mockResponse = { formUrl: "https://api.example.com/install" }

export const RedirectAcceptanceModal = (props: ConfirmationModalProps) => {

   const {
      selectedService,
   } = useServiceConfigTypeProvider();

   const { setRedirectModalOpen, setAccessPointModalOpen } = useAppProvider()

   const [loading, setLoading] = useState<boolean>(true);
   const [redirectDetails, setRedirectionDetails] = useState(mockResponse);

   const isFailed = false;

   const getRedirection = async () => {

      try {
         setLoading(true);
         const { data } = await services.services.buildInstallationFormUrl(selectedService?.id, {
            params: {
               successUrl: getSuccessUrl(),
               failureUrl: getFailureUrl()
            }
         })
         setRedirectionDetails(data)
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getRedirection()
   }, [])

   const onTryAgain = () => {
      setRedirectModalOpen(false)
      setAccessPointModalOpen(true);
   }
   const onClose = () => {
      setRedirectModalOpen(false)
   }

   return (
      <Modal
         {...props}
         footer={false}
         closeIcon={null}
      >
         {loading ? (
            <Skeleton />
         ) : (
            !isFailed ? (
               <Flex vertical gap={'middle'} align="center" justify="start">
                  <ProviderIndicator onlyLogo selectedService={selectedService} />
                  <Flex vertical gap={'small'} align="center">
                     <Typography.Title level={4} style={{ marginBottom: 0 }}>Here is the link to redirect</Typography.Title>
                     <Typography.Text type='secondary' style={{ textAlignLast: 'center' }}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus maiores rerum sed nostrum! Quae expedita dolore ipsum vitae accusantium perferendis quis asperiores, excepturi praesentium ex possimus laboriosam inventore, vel enim?
                     </Typography.Text>
                  </Flex>
                  <Flex vertical gap={'small'} style={{ width: '100%' }}>
                     <Link to={redirectDetails?.formUrl}>
                        <Button
                           type="primary"
                           block
                        >
                           Click to redirect to app
                        </Button>
                     </Link>
                     <Button
                        block
                        onClick={onClose}
                     >
                        Close
                     </Button>
                  </Flex>
               </Flex>
            ) : (
               <Result
                  title='Something went wrong!'
                  subTitle='Something went wrong with your authentication details'
                  status={'error'}
                  extra={
                     <Button onClick={onTryAgain} type="primary" >
                        Try again
                     </Button>
                  }
               />
            )
         )}
      </Modal>
   )
}