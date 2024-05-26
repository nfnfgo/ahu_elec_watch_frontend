'use client';

// Fundamentals
import React, {AriaRole, CSSProperties} from "react";

// Tools
import {classNames} from "@/tools/css_tools";
import {setDefault} from '@/tools/set_default';


interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  hasColor?: boolean;
  hasHoverColor?: boolean;
  hasHoverColorTrans?: boolean;
  hasShadow?: boolean;
  rounded?: boolean;
  expand?: boolean;
  center?: boolean;
  id?: string;
  /**Custom CSS style */
  style?: CSSProperties;
  /**
   * If true, this container will apply the basic selected pattern
   */
  selected?: boolean;
}

/**
 * The default container style flex component
 *
 * Notice:
 * - Do NOT try to pass padding style in classNames param, instead, using a
 * margin at the element that directly inside this Container
 */
export function Container(
  {
    children,
    className,
    hasColor,
    hasShadow,
    hasHoverColor,
    hasHoverColorTrans,
    rounded,
    expand,
    center,
    style,
    selected,
    id,
  }: ContainerProps) {
  // Classname default to empty string
  if (className === undefined) {
    className = '';
  }
  // hasColor default to true
  if (hasColor === undefined) {
    hasColor = true;
  }
  // hasHoverColor default to false
  if (hasHoverColor === undefined) {
    hasHoverColor = false;
  }
  if (hasHoverColorTrans === undefined) {
    hasHoverColorTrans = false;
  }
  if (hasShadow === undefined) {
    hasShadow = false;
  }
  // rounded default to true
  if (rounded === undefined) {
    rounded = true;
  }
  // expand default to false
  if (expand === undefined) {
    expand = false;
  }
  if (selected === undefined) {
    selected = false;
  }
  if (style === undefined) {
    style = undefined;
  }
  center = setDefault(center, false);

  // Container can't have default color when selected
  if (selected) {
    hasColor = false;
  }

  return (
    <>
      <div
        id={id}
        className={classNames(
          'flex min-w-0 min-h-0 overflow-hidden',
          hasColor ? 'bg-fgcolor dark:bg-fgcolor-dark' : '',
          selected ? 'bg-primary text-white' : '',
          hasShadow ? 'shadow-lg' : '',
          rounded ? 'rounded-lg' : '',
          expand ? 'h-full w-full' : '',
          className,
        )}
        style={style as CSSProperties}>
        <div className={classNames(
          'flex flex-auto h-full w-full min-w-0 min-h-0',
          hasHoverColor ? 'hover:bg-black/5 dark:hover:bg-white/5' : '',
          hasHoverColorTrans ? 'transition-colors' : '',
          center ? 'justify-center content-center' : '',
        )}>
          {children}
        </div>
      </div>
    </>);
}

export interface FlexDivProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  /**
   * Expand width and height of this flex div to fit to the parent max size
   *
   * TailwindCSS: `h-full` `w-full`
   */
  expand?: boolean;
  /**
   * Layout chilren as column (`flex-col`) if `true`
   */
  vertical?: boolean;
  /**
   * Clear minimum width and height limit, recommend to set this param to `true`
   *
   * Notice:
   * - If the `min-h` and `min-w` are not cleared for a flex div, the div may ignoring
   * the height and width limit of it's parent and acted as an overflow content
   */
  clearMinLimit?: boolean;
  style?: CSSProperties;
  /**
   * If add a padding to this element. If true, add CSS Prop `px-2` `py-2`
   */
  hasPadding?: boolean;
  /**
   * Role of the div
   *
   * Check [MDN Doc](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) for
   * more info
   */
  roleName?: AriaRole;
  /**
   * If `true`, the CSS property `display` of this element will be `block`
   *
   * Notice:
   * - `block` display type is useful when you want to achieve text overflow ellipses
   */
  displayAsBlock?: boolean;
  /**
   * If `true`, the direct `textContent` of this div will have text overflow
   * ellipsis effect
   *
   * Notice:
   * - If `true`, then `displayAsBlock` will be force set to `true`, since text ellipsis
   * will only work when CSS display type is `block`
   */
  textEllipsis?: boolean;
  /**
   * If `true`, the child of this component will be placed centered
   *
   * This is implemented using `justify-center` and `items-center`
   */
  center?: boolean;
  hidden?: boolean;
  onHoverStateChange?: (isHovered: boolean) => any;
}

export function FlexDiv(
  props: FlexDivProps,) {
  let {
    children,
    id,
    className,
    expand,
    vertical,
    clearMinLimit,
    style,
    hasPadding,
    roleName,
    displayAsBlock,
    textEllipsis,
    center,
    hidden,
    onHoverStateChange,
    ...others
  } = props;

  // set default
  className = setDefault(className, '');
  expand = setDefault(expand, false);
  clearMinLimit = setDefault(clearMinLimit, true);
  vertical = setDefault(vertical, false);
  hasPadding = setDefault(hasPadding, false);
  onHoverStateChange = setDefault(onHoverStateChange, function () {
  });
  displayAsBlock = setDefault(displayAsBlock, false);
  textEllipsis = setDefault(textEllipsis, false);
  center = setDefault(center, false);

  // always block when text ellipsis is true
  if (textEllipsis) {
    displayAsBlock = true;
  }

  return (
    <>
      <div
        role={roleName}
        hidden={hidden}
        onMouseEnter={function () {
          onHoverStateChange!(true)
        }}
        onMouseLeave={function () {
          onHoverStateChange!(false)
        }}
        className={classNames(
          displayAsBlock ? 'block' : 'flex',
          textEllipsis ? 'overflow-hidden overflow-ellipsis whitespace-nowrap' : '',
          clearMinLimit ? 'min-h-0 min-w-0' : '',
          expand ? 'h-full w-full' : '',
          vertical ? 'flex-col' : '',
          hasPadding ? 'px-2 py-2' : '',
          center ? 'justify-center items-center' : '',
          className,
        )}
        id={id}
        style={style}
        {...others}>
        {children}
      </div>
    </>);
}

/**
 * Center the child component at the center of the parent component
 *
 * Notice:
 * - This component is expansive
 */
export function Center({children, className}: { children: React.ReactNode, className?: string }) {
  return (
    <FlexDiv
      expand={true}
      className={classNames(
        'flex-row justify-center items-center',
        className ?? '',
      )}>
      {children}
    </FlexDiv>);
}

interface DividerProps {
  className?: string;
}

/**
 * Horizonal divider component
 */
export function Divider({className}: DividerProps) {
  return (<hr className={classNames(
    'opacity-10',
    className ?? '',
  )}></hr>);
}

