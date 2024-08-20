'use client';

import {useState} from "react";
import {useSearchParams} from 'next/navigation';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {DatePicker, Skeleton} from 'antd';

const {RangePicker} = DatePicker;

import {Center, FlexDiv} from '@/components/container';
import {ErrorCard} from "@/components/error";
import {BaseError, errorPopper} from "@/exceptions/error";
import {classNames} from "@/tools/css_tools";
import {inBrowserEnv} from '@/tools/general';
import {Header, HeaderTitle} from "@/components/header";
import {NoticeText} from '@/components/texts';
import {Title} from '@/components/title';
import {RecordsLineChart, RecordsList} from '@/cus_components/records';
import {DataTypeSegmented} from '@/cus_components/selections';


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
     */
    function handleTimeRangeChange(e: any) {
        let startTimeDayJs: dayjs.Dayjs = e[0];
        let endTimeDayJs: dayjs.Dayjs = e[1];

        let newStartTime = startTimeDayJs.unix();
        let newEndTime = endTimeDayJs.unix();

        setStartTime(newStartTime);
        setEndTime(newEndTime);

        // update browser url history.
        if (inBrowserEnv()) {
            let newUrl = new URL(window.location.href);
            newUrl.searchParams.set('start', newStartTime.toString());
            newUrl.searchParams.set('end', newEndTime.toString());
            window.history.pushState({}, '',
                newUrl);
        }
    }

    // show error page if start time undefined
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

                {/*Data Type Selection Part*/}
                <DataTypeSegmented value={infoType} size='large' onChange={setInfoType}/>

                {/*Line Chart Part*/}
                <FlexDiv
                    className={classNames(
                        'flex-none flex-col p-2 justify-start items-center',
                        'w-full max-h-[50rem]',
                    )}>
                    <RecordsLineChart
                        data={data}
                        noDataWarningElem={
                            <>
                                <p>No data found during this time periods. </p>
                                <p>Try reset the start time or end time and try again.</p>
                            </>
                        }
                    />
                </FlexDiv>

                {/*Records Info Table Part*/}
                <Title>
                    {infoType === 'usage' ? 'Usage' : 'Balance'}
                </Title>

                <FlexDiv className={classNames(
                    'flex-none flex-col px-2 max-w-[50rem] w-full'
                )}>
                    <RecordsList data={data ?? []} isLoading={isLoading}/>
                </FlexDiv>

                {/*Parameter Description Part*/}
                <FlexDiv className={classNames(
                    'flex-none'
                )}>
                    <NoticeText>
                        This page could be accessed with two parameters:
                        <ul>
                            <li>- <code>start</code> Used to specify the start of the time range.
                                (Currently {startTime})
                            </li>
                            <li>- <code>end</code> Used to specify the end of the time range.
                                (Currently {endTime})
                            </li>
                        </ul>
                        Both of the parameters should be in UNIX timestamp format and should be able to
                        converted to an int value.
                    </NoticeText>
                </FlexDiv>

                {/*Bottom Space Part*/}
                <FlexDiv className={classNames(
                    'flex-none h-[10rem]'
                )}></FlexDiv>
            </FlexDiv>
        </FlexDiv>
    )
        ;
}