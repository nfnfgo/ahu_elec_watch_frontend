'use client';

import {useEffect} from "react";
import toast from 'react-hot-toast';

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

  if (balanceDataError) {
    toast(JSON.stringify(balanceDataError))
    return (
      <Center>ERROR</Center>
    );
  }

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

      {/*Content Root Flex*/}
      <FlexDiv
        className={classNames(
          'flex-col flex-auto max-w-[80rem] w-full',
          'justify-start items-center'
        )}>

        {/*Balance And Statistics*/}
        <FlexDiv
          className={classNames(
            'w-full',
            'max-h-[15rem]',
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
            <BalanceInfoBlock balanceType='light' isLoading={balanceDataIsLoading} value={balanceData?.light_balance}/>
            <BalanceInfoBlock balanceType='ac' isLoading={balanceDataIsLoading} value={balanceData?.ac_balance}/>
          </FlexDiv>

          {/*Statistic Part*/}
          <FlexDiv className={classNames(
            'max-w-[30rem] w-full',
          )}>
            <StatisticBlock/>
          </FlexDiv>
        </FlexDiv>

        {/*Graph Part*/}
        <FlexDiv
          expand
          className={classNames(
            'flex-auto p-2'
          )}>
          <RecordsLineChart days={10} chartId='home_page_record_chart'/>
        </FlexDiv>
      </FlexDiv>


    </FlexDiv>
  );
}