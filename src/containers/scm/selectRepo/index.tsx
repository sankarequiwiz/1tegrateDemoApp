import { ButtonProps, Space, Typography } from 'antd';
import React, { HTMLProps } from 'react';
import { Footer } from '../../../components/footer';
import { AppContext } from '../../../context/AppProvider';
import services from '../../../services';


export const SelectRepo= React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
      const { setCurrentStep, current } = React.useContext(AppContext);
      const [loading, setLoading] = React.useState(true);
      const [data, setData] =React.useState([])



      const onOkProps: ButtonProps = {}

      const getRepos= async ()=>{
        try {
            setLoading(true);
            const data = await services.services.getRepo;
            setData(data)
            
            
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
      }
      React.useEffect(()=>{
        getRepos()
      },[])
      console.log("get repo data is printing here",data)
      return (
            <Space direction='vertical' className='w-full' style={{ height: '100%', justifyContent: 'space-between' }}>
                  <div {...props} ref={ref} id='service_profile' style={{ flex: 1 }} >
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <Typography.Text strong >Available Repositories</Typography.Text>
                        </div>
                  </div>
                  <Footer onCancel={() => setCurrentStep(current - 1)} onSubmit={() => setCurrentStep(current + 1)} onOkProps={onOkProps} />
            </Space>
      )
})