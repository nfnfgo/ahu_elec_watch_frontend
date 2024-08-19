import {Skeleton, Button} from 'antd';

import {FlexDiv, Center} from '@/components/container';
import {ErrorCard} from '@/components/error';

import {classNames} from "@/tools/css_tools";

export default function NotFound() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Center>
      <FlexDiv className={classNames(
        'flex-col justify-center items-center gap-y-2',
      )}>
        <ErrorCard
          hasColor={false}
          title='Content Not Found (404)'
          description='Page you access could no be found on this website, please check if you have entered the correct
        URL address.'
        />
        <Button type='link' href='/'>Goto Home Page</Button>
      </FlexDiv>
    </Center>
  );
}