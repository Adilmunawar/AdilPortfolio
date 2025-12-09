'use client';
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
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
const DEFAULT_BEHIND_GRADIENT = "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(189, 84%, 70%,var(--card-opacity)) 4%,hsla(189, 84%, 60%,calc(var(--card-opacity)*0.75)) 10%,hsla(195, 100%, 80%,calc(var(--card-opacity)*0.5)) 50%,hsla(240, 0%, 30%,0) 100%),radial-gradient(35% 52% at 55% 20%,#22d3eec4 0%,#0f172a00 100%),radial-gradient(100% 100% at 50% 50%,#22d3eeff 1%,#0f172a00 76%),conic-gradient(from 124deg at 50% 50%,#22d3eeff 0%,#0891b2ff 40%,#0891b2ff 60%,#22d3eeff 100%)";
const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#0f172a8c 0%,#cffafe44 100%)";
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
  avatarUrl = "/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png",
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
  status = "Online",
  contactText = "Contact Me",
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const animationHandlers = useMemo(() => {
    if (!enableTilt || !isMounted) return null;
    let rafId: number | null = null;
    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;
      const percentX = clamp(100 / width * offsetX);
      const percentY = clamp(100 / height * offsetY);
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
      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };
    const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;
      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);
        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);
        updateCardTransform(currentX, currentY, card, wrap);
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
      }
    };
  }, [enableTilt, isMounted]);
  const handlePointerMove = useCallback((event: PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    const rect = card.getBoundingClientRect();
    animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
  }, [animationHandlers]);
  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);
  const handlePointerLeave = useCallback((event: PointerEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, event.offsetX, event.offsetY, card, wrap);
    wrap.classList.remove("active");
    card.classList.remove("active");
  }, [animationHandlers]);
  useEffect(() => {
    if (!enableTilt || !animationHandlers || !isMounted) return;
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);
    
    // Only run initial animation on mount
    if (isMounted) {
      const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
      const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
      animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
      animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);
    }
    
    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [enableTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave, isMounted]);
  const cardStyle = useMemo(() => ({
    "--icon": iconUrl ? `url(${iconUrl})` : "none",
    "--grain": grainUrl ? `url(${grainUrl})` : "none",
    "--behind-gradient": showBehindGradient ? behindGradient ?? DEFAULT_BEHIND_GRADIENT : "none",
    "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT
  }) as React.CSSProperties, [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]);
  const handleContactClick = useCallback(() => {
    window.open("https://wa.me/+923244965220", "_blank");
    onContactClick?.();
  }, [onContactClick]);
  return <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <img className="avatar" src={avatarUrl} alt={`${name || "User"} avatar`} loading="lazy" onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }} />
            {showUserInfo && <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img src={miniAvatarUrl || avatarUrl} alt={`${name || "User"} mini avatar`} loading="lazy" onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = "0.5";
                  target.src = avatarUrl;
                }} />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                
              </div>}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
