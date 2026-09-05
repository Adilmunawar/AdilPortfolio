'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MIN_COPIES = 2;

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined);

/* Steady state is a CSS animation on the track (compositor only). JS only
   measures one sequence, picks the copy count and toggles play-state. */
export const LogoLoop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqSize, setSeqSize] = useState(0);
    const [copyCount, setCopyCount] = useState<number>(MIN_COPIES);
    const [isFrozen, setIsFrozen] = useState(false);
    const [isLive, setIsLive] = useState(false);

    const isVertical = direction === 'up' || direction === 'down';
    const pausesOnHover = hoverSpeed !== undefined ? hoverSpeed === 0 : pauseOnHover !== false;
    const reversed = (direction === 'right' || direction === 'down') !== speed < 0;

    const updateDimensions = useCallback(() => {
      const container = containerRef.current;
      const seq = seqRef.current;
      if (!container || !seq) return;
      const rect = seq.getBoundingClientRect();
      if (isVertical) {
        const parentHeight = container.parentElement?.clientHeight ?? 0;
        if (parentHeight > 0) {
          const target = `${Math.ceil(parentHeight)}px`;
          if (container.style.height !== target) container.style.height = target;
        }
        if (rect.height > 0) {
          const viewport = container.clientHeight || parentHeight || rect.height;
          setSeqSize(Math.ceil(rect.height));
          setCopyCount(Math.max(MIN_COPIES, Math.ceil(viewport / rect.height) + 1));
        }
      } else if (rect.width > 0) {
        setSeqSize(Math.ceil(rect.width));
        setCopyCount(Math.max(MIN_COPIES, Math.ceil(container.clientWidth / rect.width) + 1));
      }
    }, [isVertical]);

    useEffect(() => {
      const container = containerRef.current;
      const seq = seqRef.current;
      if (!container || !seq) return;

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
      }
      const ro = new ResizeObserver(updateDimensions);
      ro.observe(container);
      ro.observe(seq);
      updateDimensions();
      return () => ro.disconnect();
    }, [updateDimensions, logos, gap, logoHeight]);

    useEffect(() => {
      const images: HTMLImageElement[] = Array.from(seqRef.current?.querySelectorAll('img') ?? []);
      if (images.length === 0) return;
      let remaining = images.length;
      const done = () => {
        remaining -= 1;
        if (remaining === 0) updateDimensions();
      };
      images.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        }
      });
      return () => {
        images.forEach((img) => {
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
        });
      };
    }, [updateDimensions, logos, gap, logoHeight]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      if (!('IntersectionObserver' in window)) {
        setIsLive(true);
        return;
      }
      const io = new IntersectionObserver(([entry]) => setIsLive(entry.isIntersecting), { threshold: 0 });
      io.observe(container);
      return () => io.disconnect();
    }, []);

    const rootClassName = useMemo(
      () =>
        [
          'logoloop',
          isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'logoloop--fade',
          scaleOnHover && 'logoloop--scale-hover',
          pausesOnHover && 'logoloop--hover-pause',
          isFrozen && 'logoloop--frozen',
          isLive && 'is-live',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, pausesOnHover, isFrozen, isLive, className]
    );

    const handleClick = useCallback(() => setIsFrozen((prev) => !prev), []);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: React.Key) => {
        if (renderItem) {
          return (
            <li className="logoloop__item" key={key}>
              {renderItem(item, key)}
            </li>
          );
        }
        const content =
          'node' in item ? (
            <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
              {item.node}
            </span>
          ) : (
            <img
              src={item.src}
              srcSet={item.srcSet}
              sizes={item.sizes}
              width={item.width}
              height={item.height}
              alt={item.alt ?? ''}
              title={item.title}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
        const label = 'node' in item ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
        return (
          <li className="logoloop__item" key={key}>
            {item.href ? (
              <a className="logoloop__link" href={item.href} aria-label={label || 'logo link'} target="_blank" rel="noreferrer noopener">
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      },
      [renderItem]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul className="logoloop__list" key={`copy-${copyIndex}`} aria-hidden={copyIndex > 0} ref={copyIndex === 0 ? seqRef : undefined}>
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      (): React.CSSProperties =>
        ({
          width: isVertical ? (toCssLength(width) === '100%' ? undefined : toCssLength(width)) : (toCssLength(width) ?? '100%'),
          '--logoloop-gap': `${gap}px`,
          '--logoloop-logoHeight': `${logoHeight}px`,
          ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
          ...style,
        }) as React.CSSProperties,
      [width, isVertical, gap, logoHeight, fadeOutColor, style]
    );

    const trackStyle = useMemo(
      (): React.CSSProperties =>
        ({
          '--logoloop-seq': `${seqSize}px`,
          '--logoloop-duration': seqSize > 0 ? `${seqSize / Math.max(1, Math.abs(speed))}s` : undefined,
          animationDirection: reversed ? 'reverse' : 'normal',
        }) as React.CSSProperties,
      [seqSize, speed, reversed]
    );

    return (
      <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel} onClick={handleClick}>
        <div className="logoloop__track" style={trackStyle}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
