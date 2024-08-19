'use client';

import React, {ReactNode, useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Form, Segmented, Tooltip, Input, Button, SegmentedProps, Switch, Flex, Skeleton, Space} from 'antd';
import Link from 'next/link';

import {classNames} from "@/tools/css_tools";
import {backendBaseUrl} from '@/config/general';

import {FlexDiv, Container, Center} from '@/components/container';
import {ErrorCard} from '@/components/error';
import {NoticeText} from '@/components/texts';

import {useHeaderInfo, setAhuCredentialFromURL} from '@/api/ahu';

import {login, logout, useGetMe} from '@/api/auth';

import {errorPopper} from "@/exceptions/error";

/**
 * Part of settings page components. Used to show login UI or login info if already logged in.
 */
export function AccountInfoBlock() {
  const {
    data,
    isLoading,
    error,
  } = useGetMe();

  return (
    <FlexDiv className={classNames(
      'w-full flex-col gap-y-2 justify-start items-center p-2',
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl',
    )}>
      {isLoading && <>
          <Skeleton active/>
      </>}
      {(data === undefined && !isLoading) && <AccountLoginBlock/>}
      {data !== undefined && (
        <>
          {/*Loggin Info Root Div*/}
          <FlexDiv className={classNames(
            'flex-row justify-between items-center w-full'
          )}>
            {/*Loggin As ... Part*/}
            <FlexDiv className={classNames(
              'flex-row items-center'
            )}>
              <p>Logged in as role: </p>

              <p className={classNames(
                'bg-grey/10 rounded-xl px-2 py-1 ml-2 font-mono',
              )}>{data}</p>
            </FlexDiv>

            <Button danger onClick={logout}>Logout</Button>
          </FlexDiv>
        </>
      )}
    </FlexDiv>
  );
}

function AccountLoginBlock() {
  async function handleLogin(value: any) {
    try {
      await toast.promise(
        login(value.name, value.password).catch(function (e) {
          throw e;
        }),
        {
          loading: 'Logging into role...',
          success: 'Logged In',
          error: 'Login failed',
        }
      )
    } catch (e) {
      errorPopper(e);
    }
  }

  return (
    <>
      <Form
        labelCol={{span: 3}}
        wrapperCol={{span: 50}}
        requiredMark={false}
        className='w-full'
        onFinish={handleLogin}
      >
        <Form.Item required label='Role Name' name='name' rules={[
          {required: true, message: 'Role name can not be empty.'},
          {max: 99, message: 'Maximum role name length is 99.'}
        ]}>
          <Input placeholder='Enter role name here'/>
        </Form.Item>
        <Form.Item required label='Password' name='password' rules={[
          {required: true, message: 'Please provide password to login as this role.'},
          {max: 99, message: 'Maximum password length is 99.'}
        ]}>
          <Input.Password placeholder='Password for this role'/>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>Verify Role</Button>
        </Form.Item>
      </Form>
    </>
  );
}

/**
 * Part of settings page components. Used to show settings UI about AHU Credential Control Config.
 * @constructor
 */
export function AHULoginCredentialSettingsBlock() {
  const {
    data,
    isLoading,
    error,
  } = useGetMe();

  if (isLoading) {
    return (
      <FlexDiv className={classNames(
        'w-full min-h-[10rem]',
        'bg-fgcolor dark:bg-fgcolor-dark rounded-xl p-2',
      )}>
        <Skeleton active/>
      </FlexDiv>
    );
  }

  if (error) {
    return (
      <FlexDiv className={classNames(
        'w-full min-h-[10rem]',
        'bg-fgcolor dark:bg-fgcolor-dark rounded-xl',
      )}>
        <ErrorCard title='Role Info Error' description='Could not retrieve current role from API server'/>
      </FlexDiv>
    );
  }

  if (data !== 'admin') {
    return (
      <FlexDiv className={classNames(
        'w-full min-h-[10rem]',
        'bg-fgcolor dark:bg-fgcolor-dark rounded-xl',
      )}>
        <ErrorCard title='Permission Required'
                   description='Current role is not allowed to access/edit this settings info'/>
      </FlexDiv>
    );
  }

  return (
    <FlexDiv className={classNames(
      'w-full',
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl p-2',
      'flex-col gap-y-2',
    )}>
      <CredentialManagePart/>
    </FlexDiv>
  );
}

export function CredentialManagePart() {

  const {
    data,
    isLoading,
    error,
  } = useHeaderInfo();

  const [infoUrl, setInfoUrl] = useState('');

  async function copyAuth() {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(data?.authorization ?? '');
      toast.success('Header "Authorization" copied');
    }
  }

  async function copySynjones() {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(data?.synjones_auth ?? '');
      toast.success('Header "Synjones_Auth" copied');
    }
  }

  async function handleSetHeader() {
    if (infoUrl == undefined || infoUrl.length == 0) {
      toast.error('Enter a valid URL to update credential')
      return;
    }
    try {
      await toast.promise(
        setAhuCredentialFromURL(infoUrl).catch((e) => {
          throw e;
        }),
        {
          loading: 'Updating Synjones_Auth info...',
          error: 'Update failed',
          success: 'Synjones_Auth updated',
        }
      );
    } catch (e) {
      errorPopper(e);
    }
  }

  return (
    <>
      {/*Authorization Header Info*/}
      <Space.Compact>
        <Tooltip title='AHU "Authorization" header value'>
          <Input addonBefore='Authorization' readOnly value={data?.authorization}/>
        </Tooltip>
        <Button onClick={copyAuth}>Copy</Button>
      </Space.Compact>

      {/*Syn Header Info*/}
      <Space.Compact>
        <Tooltip title='AHU "Synjones_Auth" header value'>
          <Input addonBefore='Synjones_Auth' readOnly value={data?.synjones_auth}/>
        </Tooltip>
        <Button onClick={copySynjones}>Copy</Button>
      </Space.Compact>

      {/*Update Header From URL Part*/}
      <FlexDiv className={classNames(
        'flex-col gap-y-2 w-full',
      )}>
        <Input
          className='w-full'
          placeholder='Copy AHU Electric Balance Topup Platform URL here'
          value={infoUrl}
          onChange={function (e) {
            setInfoUrl(e.target.value);
          }}
          onKeyUp={function (e) {
            if (e.key == 'Enter') {
              handleSetHeader();
            }
          }
          }/>
        <Button type='primary' className='w-full' onClick={handleSetHeader}>Update Synjones_Auth</Button>
      </FlexDiv>

      {/*Notice Part*/}
      <NoticeText hasColor={false}>Notice: AHU Header Authorization configuration is stored in backend
        and will not be persisted as frontend settings in the browser.</NoticeText>
    </>
  );
}
