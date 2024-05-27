'use client';

import {FlexDiv} from '@/components/container';
import {classNames} from "@/tools/css_tools";
import {setDefault} from "@/tools/set_default";

interface AdaptiveBackgroundProps {
  /**
   * If this background is used as the root div and will be fullScreen?
   */
  fullScreen?: boolean;
  children?: React.ReactNode;
}

/**
 * An adaptive background component could change based on current darkmode
 */
export function AdaptiveBackground(props: AdaptiveBackgroundProps) {

  let {
    fullScreen,
  } = props;
  fullScreen = setDefault(fullScreen, true)

  return (
    <FlexDiv className={classNames(
      fullScreen ? 'h-screen w-screen' : 'h-full w-full',
      'bg-bgcolor dark:bg-bgcolor-dark',
      'flex-col justify-start items-center',
    )}>
      {props.children}
    </FlexDiv>
  );
}
