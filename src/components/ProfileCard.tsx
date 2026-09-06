'use client';
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import "./ProfileCard.css";
interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}
const DEFAULT_BEHIND_GRADIENT = "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),rgba(153, 194, 255,var(--card-opacity)) 4%,rgba(0, 102, 255,calc(var(--card-opacity)*0.75)) 10%,rgba(0, 60, 153,calc(var(--card-opacity)*0.5)) 50%,hsla(240, 0%, 30%,0) 100%),radial-gradient(35% 52% at 55% 20%,#0066ffc4 0%,#11162200 100%),radial-gradient(100% 100% at 50% 50%,#0066ffff 1%,#11162200 76%),conic-gradient(from 124deg at 50% 50%,#0066ffff 0%,#0047b3ff 40%,#0047b3ff 60%,#0066ffff 100%)";
const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#1116228c 0%,#a4adbe33 100%)";
const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60
} as const;
const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
const easeInOutCubic = (x: number): number => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl,
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  miniAvatarUrl,
  name = "Adil Munawar",
  title = "Prompt Engineer",
  handle = "Adil Munawar",
  status,
  showUserInfo = true,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltActive, setTiltActive] = useState(false);

  useEffect(() => {
    if (!enableTilt) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setTiltActive(mq.matches && !reduced.matches);
  }, [enableTilt]);

  const animationHandlers = useMemo(() => {
    if (!tiltActive) return null;
    let rafId: number | null = null;
    let writeRafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, width: number, height: number, wrap: HTMLElement) => {
      const safeWidth = width || 320;
      const safeHeight = height || 450;

      const percentX = clamp(100 / safeWidth * offsetX);
      const percentY = clamp(100 / safeHeight * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`
      };

      if (writeRafId) cancelAnimationFrame(writeRafId);
      writeRafId = requestAnimationFrame(() => {
        Object.entries(properties).forEach(([property, value]) => {
          wrap.style.setProperty(property, value);
        });
      });
    };

    const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const width = card.clientWidth || 320;
      const height = card.clientHeight || 450;
      const targetX = (wrap.clientWidth || 320) / 2;
      const targetY = (wrap.clientHeight || 450) / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);
        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, width, height, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };
      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (writeRafId) {
          cancelAnimationFrame(writeRafId);
          writeRafId = null;
        }
      }
    };
  }, [tiltActive]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    const rect = card.getBoundingClientRect();
    animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height, wrap);
  }, [animationHandlers]);
  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    card.style.willChange = "transform";
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);
  const handlePointerLeave = useCallback((event: PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, event.offsetX, event.offsetY, card, wrap);
    card.style.willChange = "";
    wrap.classList.remove("active");
    card.classList.remove("active");
  }, [animationHandlers]);
  useEffect(() => {
    if (!animationHandlers) return;
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler, { passive: true });
    card.addEventListener("pointerleave", pointerLeaveHandler);

    const safeWrapWidth = wrap.clientWidth || 320;
    const initialX = safeWrapWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    const width = card.clientWidth || 320;
    const height = card.clientHeight || 450;
    animationHandlers.updateCardTransform(initialX, initialY, width, height, wrap);
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);
  const cardStyle = useMemo(() => ({
    "--icon": iconUrl ? `url(${iconUrl})` : "none",
    "--grain": grainUrl ? `url(${grainUrl})` : "none",
    "--behind-gradient": showBehindGradient ? behindGradient ?? DEFAULT_BEHIND_GRADIENT : "none",
    "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT
  }) as React.CSSProperties, [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]);
  return <div ref={wrapRef} className={`pc-card-wrapper ${tiltActive ? 'pc-tilt' : ''} ${className}`.trim()} style={cardStyle}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <Image width={400} height={500} sizes="(max-width: 480px) 250px, 320px" className="avatar object-cover" src={avatarUrl} alt={`${name || "User"} avatar`} priority />
            {showUserInfo && <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <Image width={60} height={60} className="object-cover" src={miniAvatarUrl || avatarUrl} alt="" />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    {status && <div className="pc-status">{status}</div>}
                  </div>
                </div>

              </div>}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              {title && <p>{title}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>;
};
const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
