import {Skeleton} from 'antd';
import {FlexDiv, Center} from '@/components/container';

import {classNames} from "@/tools/css_tools";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <FlexDiv className={classNames(
      'flex-col justify-start items-center w-full max-w-[50rem]',
      'p-2',
    )}>
      <Skeleton active/>
    </FlexDiv>
  );
}