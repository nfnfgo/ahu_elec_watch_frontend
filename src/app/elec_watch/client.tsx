'use client';

import {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Segmented} from 'antd';

import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecordsLineChart} from '@/cus_components/records';

import {useGetBalance} from '@/api/info';

import * as comp from './components';

export function Client() {

  const {
    data: balanceData,
    isLoading: balanceDataIsLoading,
    error: balanceDataError,
  } = useGetBalance();

  // Store graph days duration states
  const [
    graphShowDays,
    setGraphShowDays] = useState<number>(3);

  const [graphType, setGraphType]
    = useState<'balance' | 'usage'>('balance');

  return (
    <FlexDiv
      expand
      className={classNames(
        'flex-col flex-none',
        'justify-start items-center',
      )}>

      {/*Header Part*/}
      <Header
        link='/elec_watch_test'
        content={(
          <comp.LastUpdateInfoTag
            timeStamp={balanceData?.timestamp}
            isLoading={balanceDataIsLoading}
          />
        )}>
        <HeaderTitle>AHU Electrical Usage Monitor</HeaderTitle>
      </Header>

      {/*Scrolling Root Div*/}
      <FlexDiv
        expand
        className={classNames(
          'flex-col justify-start items-center',
          'flex-auto overflow-y-auto rounded-2xl',
        )}>

        {/*Content Root Div*/}
        <FlexDiv
          className={classNames(
            'flex-col max-w-[80rem] w-full',
            'justify-start items-center',
          )}>

          {/*Balance And Statistics*/}
          <FlexDiv
            className={classNames(
              'w-full',
              'max-h-[15rem]',
              'flex-none',
              'flex-row gap-x-2 p-2',
              'sm:min-h-[10rem]',
              'justify-center',
            )}>
            {/*Balance Monitor Block*/}
            <FlexDiv
              className={classNames(
                'flex-none flex-col sm:flex-row',
                'gap-y-2 sm:gap-x-2',
                'h-full',
                'sm:min-w-[20rem]',
              )}>
              <BalanceInfoBlock balanceType='light' isLoading={balanceDataIsLoading}
                                value={balanceData?.light_balance}/>
              <BalanceInfoBlock balanceType='ac' isLoading={balanceDataIsLoading} value={balanceData?.ac_balance}/>
            </FlexDiv>

            {/*Statistic Part*/}
            <FlexDiv className={classNames(
              'max-w-[30rem] w-full',
            )}>
              <StatisticBlock/>
            </FlexDiv>
          </FlexDiv>

          {/*Balance Usage Graph Part*/}
          <FlexDiv
            className={classNames(
              'w-full flex-none',
              'flex-col p-2',
            )}>

            <FlexDiv
              className={classNames(
                'w-full flex-col gap-y-2 p-2',
                'bg-fgcolor dark:bg-fgcolor-dark',
                'rounded-2xl',
              )}>

              <FlexDiv className={classNames(
                'flex-none',
                'flex-col justify-start items-center gap-y-2',
                'sm:flex-row sm:justify-between sm:items-center',
              )}>
                {/*Switch the time duration range of the graph*/}
                <Segmented
                  value={graphShowDays}
                  size='large'
                  options={[
                    {
                      label: '24 Hours',
                      value: 1,
                    },
                    {
                      label: '3 Days',
                      value: 3
                    },
                    {
                      label: 'Weekly',
                      value: 7,
                    },
                    {
                      label: 'Monthly',
                      value: 30,
                    },
                  ]}
                  onChange={setGraphShowDays}/>

                <Segmented
                  value={graphType}
                  size='large'
                  options={[{
                    label: 'Balance',
                    value: 'balance',
                  },
                    {
                      label: 'Usage',
                      value: 'usage',
                    },]}
                  onChange={setGraphType}/>
              </FlexDiv>

              <RecordsLineChart days={graphShowDays} graphType={graphType}/>
            </FlexDiv>
          </FlexDiv>

          <FlexDiv className={classNames(
            'h-[100rem] bg-red flex-none'
          )}>
            Test
          </FlexDiv>
        </FlexDiv>
      </FlexDiv>

    </FlexDiv>
  );
}