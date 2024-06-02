'use client';

import dayjs from "dayjs";
import {classNames} from "@/tools/css_tools";
import {useEffect, useRef, useState} from "react";

import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-4';
import toast from 'react-hot-toast';

Chart.register();

import {Table, Tooltip} from 'antd';

const {Column, ColumnGroup} = Table;

import {FlexDiv, Container, Center} from '@/components/container';
import {setDefault} from "@/tools/set_default";
import {
  StatisticIn, useGetRecentRecords,
  PeriodUsageInfoIn, useGetPeriodUsage,
  PeriodUnit,
} from '@/api/info';
import {errorPopper} from '@/exceptions/error';


interface RecordsLineChartProps {
  /**
   * The days range of the info this graph will show. At least one day.
   */
  days: number;
  /**
   * Info type of this graph.
   */
  graphType?: 'balance' | 'usage';
}

export function RecordsLineChart(props: RecordsLineChartProps) {
  const {
    data: recordData,
    isLoading,
    error,
  } = useGetRecentRecords(props.days, props.graphType ?? 'balance');

  if (error) {
    errorPopper(error);
  }

  let canvasRef = useRef();

  return (
    <FlexDiv
      className={classNames(
        'flex-none w-full',
      )}>
      <Line
        className={classNames(
          'flex flex-auto h-full w-full bg-fgcolor dark:bg-fgcolor-dark p-4',
          'rounded-2xl',
        )}
        ref={canvasRef}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'transparent',
          scales: {
            x: {
              ticks: {},
              type: 'time',
              time: {
                minUnit: 'hour',
                displayFormats: {},
              }
            }
          },
          plugins: {
            tooltip: {
              intersect: false,
            }
          },
        }}
        data={{
          datasets: [
            {
              label: 'Illumination Usage',
              data: recordData?.map((d) => (d.light_balance)) ?? [],
              borderColor: 'rgba(10,186,0,0.54)',
              backgroundColor: 'green',
            },
            {
              label: 'Air Conditioner Usage',
              data: recordData?.map((d) => (d.ac_balance)) ?? [],
              borderColor: 'rgba(0,123,172,0.54)',
              backgroundColor: 'blue',
            }
          ],
          labels: recordData?.map((d) => (d.timestamp * 1000)) ?? []
        }}/>
    </FlexDiv>
  );
}

interface PeriodUsageProps {
  /**
   * The period unit of the info.
   */
  period: PeriodUnit;
  /**
   * Number of periods shows in the table.
   */
  period_count: number;
  /**
   * If `true`, the latest info will at the beginning.
   */
  recent_on_top: boolean;
}

export function PeriodUsageList(props: PeriodUsageProps) {

  const {
    data,
    isLoading,
    error,
  } = useGetPeriodUsage(props.period, props.period_count, props.recent_on_top);

  if (error) {
    errorPopper(error);
  }

  /**
   * Function that passed to antd Table component as a column data renderer for usage info.
   */
  function usageColumnRendererInner(usage: number, infoType: 'light' | 'ac' = 'light') {
    let days = 1;
    if (props.period == 'week') {
      days = 7;
    }
    if (props.period == 'month') {
      days = 30;
    }

    return (<Tooltip
      title={`${(usage / days).toFixed(2)} kW/day`}
      placement='leftBottom'>
      <p className={classNames(
        'font-mono',
        infoType == 'light' ? 'text-blue dark:text-blue-light' : '',
        infoType == 'ac' ? 'text-green dark:text-green-light' : '',
      )}>{usage.toFixed(2)}</p>
    </Tooltip>);
  }

  function usageColumnRendererGen(infoType: 'light' | 'ac' = 'light') {
    return function (value: number) {
      return usageColumnRendererInner(value, infoType);
    }
  }

  /**
   * Function that passed to antd Table component as a column data renderer for start and end timestamp.
   */
  function timestampColumnRenderer(timestamp: number) {
    let dayjsIns = dayjs.unix(timestamp);
    return (<p className={classNames(
      'whitespace-nowrap',
    )}>
      {dayjsIns.format('MM/DD')}
    </p>);
  }


  return (
    <FlexDiv
      className={classNames(
        'flex-none flex-col w-full',
      )}
    >
      <Table
        // style={{
        //   width: '100%'
        // }}
        sticky={true}
        loading={isLoading}
        pagination={false}
        dataSource={data}
        className={classNames(
          'rounded-xl'
        )}>
        <Column title='From' dataIndex='start_time' key='start_time' render={timestampColumnRenderer} width={80}/>
        <Column title='To' dataIndex='end_time' key='end_time' render={timestampColumnRenderer} width={80}/>
        <ColumnGroup title='Usage'>
          <Column title='Illumination' dataIndex='light_usage' key='light_usage'
                  render={usageColumnRendererGen('light')}/>
          <Column title='Air Conditioner' dataIndex='ac_usage' key='ac_usage'
                  render={usageColumnRendererGen('ac')}/>
        </ColumnGroup>
      </Table>
    </FlexDiv>
  );
}
