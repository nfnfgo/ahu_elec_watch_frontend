'use client';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Tooltip} from 'antd';

import {BalanceRecordIn} from '@/api/info';
import {FlexDiv} from "@/components/container";
import {classNames} from "@/tools/css_tools";

export const test = 'test';


interface LastUpdateInfoTagProps {
  /**
   * The timestamp used as the latest update time.
   */
  timeStamp?: number;
  /**
   * Is the info still loading? If `true`, allow timeStamp to be undefined.
   */
  isLoading?: boolean;
}

/**
 * Last update tag, used on the right of the header
 * @constructor
 */
export function LastUpdateInfoTag(props: LastUpdateInfoTagProps) {
  let {
    timeStamp,
    isLoading,
  } = props;

  let error = !isLoading && timeStamp == undefined;


  function getDurationString(): string {
    if (error) {
      return 'Error';
    }
    if (isLoading) {
      return '--';
    }
    dayjs.extend(duration);
    let du = dayjs.duration(dayjs().diff(dayjs.unix(timeStamp ?? 0)));
    if (du.asSeconds() < 5) {
      return 'Just now';
    }
    if (du.asHours() < 1) {
      return `${du.minutes()} mins ago`;
    }
    if (du.asDays() < 1) {
      return `${du.hours()}h ${du.minutes()}m ago`;
    }
    if (du.asDays() > 100) {
      return 'So long ago';
    }
    return `${du.days()}d ${du.hours()}h ago`;
  }

  return (
    <Tooltip
      title='Current strategy is catch info from AHU website at the 30th minute of every hour.'
      placement='bottomLeft'>
      <FlexDiv className={classNames(
        'rounded-xl px-2 py-1',
        error ? 'bg-red/20 dark:bg-red-light/20' : '',
        isLoading ? 'bg-grey/20' : '',
        (!isLoading && !error) ? 'bg-blue/20 text-blue dark:text-blue-light' : '',
        'justify-center items-center',
      )}>
        <p>
          Last Update: <span className='whitespace-nowrap'>{getDurationString()}</span>
        </p>
      </FlexDiv>
    </Tooltip>
  );
}

