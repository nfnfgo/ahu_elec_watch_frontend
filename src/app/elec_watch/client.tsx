'use client';

import {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Segmented, Tooltip, Button, Space, Divider, Flex} from 'antd';
import Link from 'next/link';

import {classNames} from "@/tools/css_tools";
import {backendBaseUrl} from '@/config/general';

import {TbSettings2} from "react-icons/tb";
import {FaGithub} from "react-icons/fa";
import {FaCode} from "react-icons/fa";
import {FaClipboardList} from "react-icons/fa";

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecentUsageLineChart, PeriodUsageList} from '@/cus_components/records';

import {useGetBalance, PeriodUnit} from '@/api/info';

import * as comp from './components';
import {Title} from '@/components/title';
import {
  ChartItemCountSegmented,
  ChartTimeRangeSegmented,
  DataTypeSegmented,
  DiagramDaysRangeSegmented
} from '@/cus_components/selections';
import {useSettingsStore} from '@/states/settings';


export function Client() {

  const defaultDiagDays = useSettingsStore(state => state.settings.diagramDays);
  const defaultDiagType = useSettingsStore(state => state.settings.diagramType);
  const defaultChartTimeRange = useSettingsStore(state => state.settings.chartTimeRange);
  const defaultChartItemCount = useSettingsStore(state => state.settings.chartItemsCount);

  const {
    data: balanceData,
    isLoading: balanceDataIsLoading,
    error: balanceDataError,
  } = useGetBalance();

  // Store graph days duration states
  const [
    graphShowDays,
    setGraphShowDays] = useState<number | undefined>(undefined);

  const [graphType, setGraphType]
    = useState<'balance' | 'usage' | undefined>(undefined);

  const [tableDataDuration, setTableDataDuration] =
    useState<PeriodUnit | undefined>(undefined);

  const [periodCount, setPeriodCount] =
    useState<number | undefined>(undefined);

  return (
    <FlexDiv
      expand
      className={classNames(
        'flex-col flex-none',
        'justify-start items-center',
      )}>

      {/*Header Part*/}
      <Header
        link='/'
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
              'text-base',
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
              <BalanceInfoBlock balanceType='ac' isLoading={balanceDataIsLoading}
                                value={balanceData?.ac_balance}/>
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

              {/*Graph Option Bar*/}
              <FlexDiv className={classNames(
                'flex-none',
                'flex-col justify-start items-center gap-y-2',
                'sm:flex-row sm:justify-between sm:items-center',
              )}>
                {/*Switch the time duration range of the graph*/}
                <DiagramDaysRangeSegmented
                  size='large'
                  value={graphShowDays ?? defaultDiagDays}
                  onChange={setGraphShowDays}
                />

                <DataTypeSegmented
                  size='large'
                  value={graphType ?? defaultDiagType}
                  onChange={setGraphType}
                />
              </FlexDiv>

              <RecentUsageLineChart days={graphShowDays ?? defaultDiagDays}
                                    graphType={graphType ?? defaultDiagType}/>
            </FlexDiv>
          </FlexDiv>

          <Title>{tableDataDuration == 'day' && 'Daily'}
            {tableDataDuration == 'week' && 'Weekly'}
            {tableDataDuration == 'month' && 'Monthly'} Usage</Title>

          {/*Period Usage Table Padding Flex*/}
          <FlexDiv className={classNames(
            'flex-col flex-none w-full p-2 items-center max-w-[50rem]',
          )}>
            {/*Period Usage Table Root Flex*/}
            <FlexDiv
              className={classNames(
                'flex-col flex-none w-full max-w-[50rem] rounded-2xl overflow-hidden',
                'bg-fgcolor dark:bg-fgcolor-dark',
              )}>

              {/*Segment Control Bar*/}
              <FlexDiv className={classNames(
                'flex-row justify-between w-full p-2',
              )}>
                <ChartTimeRangeSegmented
                  size='large'
                  value={tableDataDuration ?? defaultChartTimeRange}
                  onChange={setTableDataDuration}/>

                <ChartItemCountSegmented size={'large'} value={periodCount ?? defaultChartItemCount}
                                         onChange={setPeriodCount}/>
              </FlexDiv>

              <PeriodUsageList
                period={tableDataDuration ?? defaultChartTimeRange}
                period_count={periodCount ?? defaultChartItemCount}
                recent_on_top={true}/>
            </FlexDiv>
          </FlexDiv>

          {/*Action Button Part*/}
          <FlexDiv className={classNames(
            'flex-col flex-none w-full p-2 items-center max-w-[50rem]',
          )}>
            <Link className='w-full' href='/settings'>
              <Button className='w-full'>
                <p>
                  <TbSettings2 className={'inline-block align-text-bottom'}/> Settings
                </p>
              </Button>
            </Link>
          </FlexDiv>

          {/*Footer Part*/}
          <FlexDiv className={classNames(
            'p-2',
            'flex-none flex-col sm:flex-row gap-2 sm:gap-4',
            'justify-center items-center'
          )}>
            <Link target='_blank' href={`${backendBaseUrl}/docs`}>
              <p>
                <FaCode className='inline-block align-middle'/> Backend Interactive API Docs
              </p>
            </Link>
            <Link target='_blank' href='https://github.com/nfnfgo/ahu_elec_watch_frontend'>
              <FaGithub className={'inline-block align-middle'}/> Github Frontend Repo
            </Link>
            <Link target='_blank' href='https://github.com/orgs/NFSandbox/projects/1'>
              <FaClipboardList className='inline-block align-middle'/> Github Project
            </Link>
          </FlexDiv>
          {/*Records Statistics Footer Part*/}
          <comp.RecordsStatisticsFooter></comp.RecordsStatisticsFooter>

          <FlexDiv className={classNames(
            'flex-none',
            'p-[5rem]'
          )}>
          </FlexDiv>


        </FlexDiv>
      </FlexDiv>

    </FlexDiv>
  );
}