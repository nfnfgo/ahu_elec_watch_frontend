'use client';

import {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Segmented, Tooltip} from 'antd';

import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecordsLineChart, DailyUsageList} from '@/cus_components/records';

import {useGetBalance} from '@/api/info';

import * as comp from './components';
import {Title} from '@/components/title';


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
          'flex-auto overflow-y-auto',
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
              'max-h-[15rem] max-w-[50rem]',
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
              'w-full',
            )}>
              <StatisticBlock/>
            </FlexDiv>
          </FlexDiv>

          <Title>{graphType == 'balance' ? 'Balance Trends' : 'Usage Trends'}</Title>

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

          <Title>Daily Usage</Title>

          <FlexDiv className={classNames(
            'flex-col flex-none w-full p-2 items-center max-w-[50rem]',
          )}>
            <DailyUsageList days={14} recent_on_top={true}/>
          </FlexDiv>

          <FlexDiv
            className={classNames(
              'flex-none h-[100rem]'
            )}
          >
            test
          </FlexDiv>
        </FlexDiv>
      </FlexDiv>

    </FlexDiv>
  );
}