'use client';

import React, {ReactNode, useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Form, Segmented, Tooltip, Input, Button, SegmentedProps, Switch, Flex, Skeleton} from 'antd';
import Link from 'next/link';

import {classNames} from "@/tools/css_tools";
import {backendBaseUrl} from '@/config/general';

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecordsLineChart, PeriodUsageList} from '@/cus_components/records';


import {
  login,
  logout,
  useGetMe,
} from '@/api/auth';

import {Title} from '@/components/title';

import {
  useSettingsStore,
  Settings,
} from '@/states/settings';

import {
  ChartItemCountSegmented,
  ChartTimeRangeSegmented,
  DataTypeSegmented,
  DiagramDaysRangeSegmented
} from "@/cus_components/selections";
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
          <Skeleton/>
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
  ;
}
