'use client';

import {useSearchParams} from 'next/navigation';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {DatePicker, Skeleton} from 'antd';

const {RangePicker} = DatePicker;

import {Center, FlexDiv} from '@/components/container';
import {ErrorCard} from "@/components/error";
import {BaseError, errorPopper} from "@/exceptions/error";
import {classNames} from "@/tools/css_tools";
import {Header, HeaderTitle} from "@/components/header";
import {useState} from "react";

import {useGetRecordByTimeRange} from '@/api/info';
import Loading from "@/app/loading";


export function Client() {
  // retrieve URL query params.
  const searchParams = useSearchParams();

  // extract
  function extractParamTimestamp(paramKey: string): number | undefined {
    let tmp = searchParams.get(paramKey);
    if (tmp == null) {
      return undefined;
    }
    try {
      let tmpInt = parseInt(tmp);
      if (isNaN(tmpInt)) {
        throw 'error';
      }
      return parseInt(tmp);
    } catch (e) {
      let err = new BaseError('param_error', 'Could not parse timestamp param as int value');
      errorPopper(err);
      return undefined;
    }
  }

  const _startTime = extractParamTimestamp('start');
  const _endTime = extractParamTimestamp('end');

  // extract time range info from URL param.
  const [startTime, setStartTime] = useState(_startTime);
  const [endTime, setEndTime] = useState(_endTime ?? dayjs().unix());
  const [infoType, setInfoType] = useState<'balance' | 'usage'>('usage');

  // Get records info based on range
  const {
    data,
    isLoading,
    error,
  } = useGetRecordByTimeRange(
    startTime ?? 0,
    endTime ?? 0,
    infoType,
  );


  /**
   * Handle timestamp selection change from AntD Range Picker UI Component.
   * @param e
   */
  function handleTimeRangeChange(e: any) {
    let startTimeDayJs: dayjs.Dayjs = e[0];
    let endTimeDayJs: dayjs.Dayjs = e[1];
    setStartTime(startTimeDayJs.unix());
    setEndTime(endTimeDayJs.unix());

    // todo
    // Update browser url.
  }


  if (startTime === undefined) {
    return (
      <Center>
        <ErrorCard
          hasColor={false}
          title='Parameter Required'
          description='Period usage statistics page requires a specified start time'/>
      </Center>
    );
  }

  return (
    // Root Div
    <FlexDiv
      expand
      className={classNames(
        'flex-col flex-none gap-y-2',
      )}>

      {/*Header Part*/}
      <Header link='/'>
        <HeaderTitle>Period Usage - AHU Elec Watch</HeaderTitle>
      </Header>

      {/*Scroll Root Div*/}
      <FlexDiv
        expand
        className={classNames(
          'justify-start items-center',
          'flex-col gap-y-2 overflow-y-auto',
        )}>

        {/*Date Range Picker Part*/}
        <FlexDiv className={classNames(
          'flex-none flex-col gap-y-2 p-2 w-full max-w-[50rem] justify-start items-center'
        )}>
          <RangePicker
            className='w-full'
            defaultValue={[dayjs.unix(startTime), dayjs.unix(endTime ?? dayjs().unix())]}
            onChange={handleTimeRangeChange}/>
        </FlexDiv>

        <p>{startTime}</p>
        <p>{endTime}</p>
        <pre className='whitespace-pre-wrap'>{JSON.stringify(data, undefined, '  ') ?? 'No Data / Loading'}</pre>
        <FlexDiv className='min-h-[100rem]'></FlexDiv>
      </FlexDiv>

    </FlexDiv>
  );
}