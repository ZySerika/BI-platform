import { Footer } from '@/components';
import { listChartByPageUsingPOST } from '@/services/zybi/chartController';
import { getLoginUserUsingGET, userLoginUsingPOST, userRegisterUsingPOST } from '@/services/zybi/userController';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import Settings from '../../../../config/defaultSettings';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  useEffect(() => {
    listChartByPageUsingPOST({}).then(res => {
        console.error('res', res)
    })
  })

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // Submit register request
      const res = await userRegisterUsingPOST(values);
      if (res.code === 0) {
        const defaultRegisterSuccessMessage = 'Register successful!';
        message.success(defaultRegisterSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        const redirectTo = urlParams.get('redirect') ? `?redirect=${urlParams.get('redirect')}` : '';
        history.push(`/user/login${redirectTo}`);
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = 'Register failed, please retry!';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'Register'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="GPT BI"
          subTitle={'A prompt business intelligence'}
          submitter={{
            searchConfig: {
                submitText: 'Register'
            }
          }}
          initialValues={{
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: 'Account Register',
              },
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'Account:'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter username!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'Password:'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter password!',
                  },
                ]}
              />
                <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'Repeat Password:'}
                rules={[
                  {
                    required: true,
                    message: 'Please repeat password!',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
