import {FlexDiv, Container} from "@/components/container";
import Link from "next/link";
import {classNames} from "@/tools/css_tools";
import React from "react";

interface HeaderProps {
  /**
   * The Header Children which will be used as header title (and will become the clickable part.)
   */
  children?: React.ReactNode;
  /**
   * Jump to this link when Header content has been clicked.
   */
  link?: string;
  /**
   * The content showed in the right of the header, will NOT jump to link when click.
   */
  content?: React.ReactNode;
}

/**
 * Header components.
 */
export function Header(props: HeaderProps) {
  let {
    link,
    children,
    content,
  } = props;

  return (
    // Responsive Margin
    <FlexDiv
      className={classNames(
        'w-full z-10',
        'flex-none',
        'transition-all')}>

      {/*Header Root Flex Div*/}
      <FlexDiv
        className={classNames(
          'bg-fgcolor dark:bg-fgcolor-dark',
          'w-full p-2 shadow-lg',
          'transition-all',
          'flex-row justify-between',
        )}>

        {/*Link Wrapper For Children Content*/}
        <Link
          href={link ?? '#'}
          className={classNames(
            'hover:no-underline hover:scale-[1.02]',
          )}>
          {children}
        </Link>

        <FlexDiv>
          {content}
        </FlexDiv>
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