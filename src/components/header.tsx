import {FlexDiv, Container} from "@/components/container";
import Link from "next/link";
import {classNames} from "@/tools/css_tools";
import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
  /**
   * Jump to this link when Header content has been clicked.
   */
  link?: string;
}

export function Header(props: HeaderProps) {
  let {
    link,
    children,
  } = props;

  return (
    // Responsive Margin
    <FlexDiv
      className={classNames('p-0 md:p-2')}>

      {/*Header Root Flex Div*/}
      <FlexDiv
        className={classNames(
          'bg-fgcolor dark:bg-fgcolor-dark',
          'w-full p-2 shadow-xl',
          'md:rounded-xl'
        )}>

        {/*Link Wrapper For Children Content*/}
        <Link href={link ?? '#'}>
          {children}
        </Link>
      </FlexDiv>
    </FlexDiv>
  );
}

interface HeaderTitleProps {
  children?: React.ReactNode;
  usePrimary?: boolean;
}

export function HeaderTitle(props: HeaderTitleProps) {
  let {
    children,
    usePrimary,
  } = props;

  usePrimary = usePrimary ?? true;

  return (<p className={classNames(
    usePrimary ? 'text-primary dark:text-primary-light' : '',
    'text-xl font-bold md:text-2xl',
  )}>{children}</p>);
}