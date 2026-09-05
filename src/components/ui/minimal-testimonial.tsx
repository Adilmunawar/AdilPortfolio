"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Quote } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    quote:
      "Co-founding Nexus Orbits Pakistan with Adil has been a highlight of my career. After years of collaborating on countless projects, I can attest to his exceptional skill and vision as a web developer and partner.",
    author: "Zoya Ali",
    role: "Web Developer & Co-founder",
    avatar: "/testimonials/zoya.jpg",
  },
  {
    id: 4,
    quote:
      "Adil consistently impressed me with his dedication, professionalism, he is a great team player and communicator.",
    author: "Amna Ali",
    role: "HR Manager",
    avatar: "/testimonials/AmnaAli.jpg",
  },
  {
    id: 3,
    quote:
      "Collaborating with Adil was seamless, builds high performing sites that make digital marketing actually work. Exceptional developer!",
    author: "Esha Riaz",
    role: "Digital Marketer",
    avatar: "/testimonials/esha.jpg",
  },
  {
    id: 2,
    quote: "I have been profoundly impressed by Adil's remarkable aptitude for web development and problem-solving.",
    author: "Alice Austen",
    role: "Design Lead at Linear",
    avatar: "/testimonials/alice.png",
  },
]

const SWAP_MS = 200

export function TestimonialsMinimal() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const timer = useRef<number | null>(null)
  const listButtons = useRef<(HTMLButtonElement | null)[]>([])
  const rowButtons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const select = useCallback(
    (index: number) => {
      if (index === activeIndex || pendingIndex !== null) return
      setPendingIndex(index)
      timer.current = window.setTimeout(() => {
        setActiveIndex(index)
        setPendingIndex(null)
        timer.current = null
      }, SWAP_MS)
    },
    [activeIndex, pendingIndex],
  )

  const onArrowKeys = (refs: (HTMLButtonElement | null)[]) => (e: KeyboardEvent<HTMLElement>) => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]
    if (!keys.includes(e.key)) return
    const current = refs.findIndex((el) => el === document.activeElement)
    if (current === -1) return
    e.preventDefault()
    const last = testimonials.length - 1
    let next = current
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = current === 0 ? last : current - 1
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = current === last ? 0 : current + 1
    if (e.key === "Home") next = 0
    if (e.key === "End") next = last
    refs[next]?.focus()
    select(next)
  }

  const active = testimonials[activeIndex]
  const swapping = pendingIndex !== null

  return (
    <div
      role="group"
      aria-label="Testimonials"
      className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6"
    >
      <figure
        aria-live="polite"
        className="relative flex min-w-0 flex-col rounded-xl border border-white/[0.06] bg-[#111622] p-5 sm:p-6 lg:p-8"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[rgba(0,102,255,0.12)] text-[#5c9dff] ring-1 ring-inset ring-[rgba(0,102,255,0.22)]"
        >
          <Quote size={18} strokeWidth={1.75} />
        </span>

        <div
          className={cn(
            "flex flex-1 flex-col transition-[opacity,transform] duration-200 ease-out-quart",
            swapping ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          <blockquote className="mt-5 text-[18px] leading-[1.55] text-[#f2f4f8] lg:min-h-[7.75rem] lg:text-[20px] lg:leading-[1.5]">
            &ldquo;{active.quote}&rdquo;
          </blockquote>

          <span aria-hidden="true" className="mt-6 block h-0.5 w-8 rounded-full bg-[#0066ff]" />

          <figcaption className="mt-4 flex items-center gap-3">
            <Image
              src={active.avatar || "/placeholder.svg"}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full border border-white/[0.10] object-cover"
            />
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-[#f2f4f8]">{active.author}</span>
              <span className="block text-[13px] text-[#6f7888]">{active.role}</span>
            </span>
          </figcaption>
        </div>
      </figure>

      <div
        className="hidden flex-col gap-1 lg:flex"
        onKeyDown={onArrowKeys(listButtons.current)}
      >
        {testimonials.map((t, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={t.id}
              type="button"
              ref={(el) => { listButtons.current[index] = el }}
              onClick={() => select(index)}
              aria-pressed={isActive}
              aria-label={`Show testimonial from ${t.author}`}
              className={cn(
                "focus-ring flex min-h-[44px] w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 ease-standard",
                isActive
                  ? "border-white/[0.10] bg-[#171d2b]"
                  : "border-transparent hover:border-white/[0.06] hover:bg-[#171d2b]",
              )}
            >
              <span
                className={cn(
                  "shrink-0 rounded-full p-0.5 ring-2",
                  isActive ? "ring-[#0066ff]" : "ring-transparent",
                )}
              >
                <Image
                  src={t.avatar || "/placeholder.svg"}
                  alt=""
                  width={36}
                  height={36}
                  className={cn(
                    "h-9 w-9 rounded-full object-cover transition-opacity duration-150",
                    isActive ? "opacity-100" : "opacity-70",
                  )}
                />
              </span>
              <span className="min-w-0">
                <span className={cn("block truncate text-[14px] font-medium", isActive ? "text-[#f2f4f8]" : "text-[#a4adbe]")}>
                  {t.author}
                </span>
                <span className="block truncate text-[13px] text-[#6f7888]">{t.role}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        className="flex items-center gap-2 lg:hidden"
        onKeyDown={onArrowKeys(rowButtons.current)}
      >
        {testimonials.map((t, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={t.id}
              type="button"
              ref={(el) => { rowButtons.current[index] = el }}
              onClick={() => select(index)}
              aria-pressed={isActive}
              aria-label={`Show testimonial from ${t.author}`}
              className={cn(
                "focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2",
                isActive ? "ring-[#0066ff]" : "ring-transparent",
              )}
            >
              <Image
                src={t.avatar || "/placeholder.svg"}
                alt=""
                width={36}
                height={36}
                className={cn(
                  "h-9 w-9 rounded-full border border-white/[0.10] object-cover transition-opacity duration-150",
                  isActive ? "opacity-100" : "opacity-60",
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
