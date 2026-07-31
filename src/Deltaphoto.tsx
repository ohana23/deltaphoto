"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type DeltaphotoProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
  initialPosition?: number;
  position?: number;
  onPositionChange?: (position: number) => void;
  aspectRatio?: CSSProperties["aspectRatio"];
  objectFit?: CSSProperties["objectFit"];
  foregroundColor?: CSSProperties["color"];
  backgroundColor?: CSSProperties["backgroundColor"];
  ariaLabel?: string;
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function Deltaphoto({
  before,
  after,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
  showLabels = true,
  initialPosition = 50,
  position,
  onPositionChange,
  aspectRatio = "3 / 2",
  objectFit = "cover",
  foregroundColor = "#000",
  backgroundColor = "#fff",
  ariaLabel = "Compare before and after images",
  className = "",
  style,
  ...rest
}: DeltaphotoProps) {
  const [internalPosition, setInternalPosition] = useState(() =>
    clamp(initialPosition),
  );
  const currentPosition = clamp(position ?? internalPosition);
  const [displayPosition, setDisplayPosition] = useState(currentPosition);
  const displayPositionRef = useRef(currentPosition);
  const targetPositionRef = useRef(currentPosition);
  const pointerIsDownRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);

  const setDisplayedPosition = useCallback((nextPosition: number) => {
    const next = clamp(nextPosition);
    displayPositionRef.current = next;
    setDisplayPosition(next);
  }, []);

  const stopSmoothing = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    previousFrameTimeRef.current = null;
  }, []);

  const startSmoothing = useCallback(() => {
    if (animationFrameRef.current !== null) return;

    const step = (timestamp: number) => {
      const previousTimestamp = previousFrameTimeRef.current ?? timestamp;
      const elapsed = timestamp - previousTimestamp;
      previousFrameTimeRef.current = timestamp;

      const current = displayPositionRef.current;
      const target = targetPositionRef.current;
      const difference = target - current;

      if (Math.abs(difference) < 0.05) {
        setDisplayedPosition(target);
        animationFrameRef.current = null;
        previousFrameTimeRef.current = null;
        return;
      }

      const catchUp = 1 - Math.exp(-elapsed / 85);
      setDisplayedPosition(current + difference * catchUp);
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [setDisplayedPosition]);

  useEffect(() => {
    targetPositionRef.current = currentPosition;

    if (pointerIsDownRef.current) {
      startSmoothing();
    } else if (animationFrameRef.current === null) {
      setDisplayedPosition(currentPosition);
    }
  }, [currentPosition, setDisplayedPosition, startSmoothing]);

  useEffect(() => stopSmoothing, [stopSmoothing]);

  const updatePosition = useCallback(
    (nextPosition: number) => {
      const next = clamp(nextPosition);
      if (position === undefined) setInternalPosition(next);
      onPositionChange?.(next);
    },
    [onPositionChange, position],
  );

  const handlePointerDown = useCallback(() => {
    pointerIsDownRef.current = true;
    targetPositionRef.current = currentPosition;
  }, [currentPosition]);

  const handlePointerEnd = useCallback(() => {
    pointerIsDownRef.current = false;
    startSmoothing();
  }, [startSmoothing]);

  const handleChange = useCallback(
    (nextPosition: number) => {
      targetPositionRef.current = nextPosition;
      updatePosition(nextPosition);

      if (pointerIsDownRef.current) {
        startSmoothing();
      } else {
        setDisplayedPosition(nextPosition);
      }
    },
    [setDisplayedPosition, startSmoothing, updatePosition],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const nextPosition =
        event.key === "ArrowLeft"
          ? currentPosition <= 50
            ? 0
            : 50
          : currentPosition >= 50
            ? 100
            : 50;
      handleChange(nextPosition);
    },
    [currentPosition, handleChange],
  );

  const rootStyle = {
    ...style,
    aspectRatio,
    "--deltaphoto-position": `${displayPosition}%`,
    "--deltaphoto-fit": objectFit,
    "--deltaphoto-foreground": foregroundColor,
    "--deltaphoto-background": backgroundColor,
  } as CSSProperties;

  return (
    <div className={`deltaphoto ${className}`.trim()} style={rootStyle} {...rest}>
      <img
        className="deltaphoto__image deltaphoto__image--after"
        src={after}
        alt={afterAlt}
        draggable={false}
      />
      <img
        className="deltaphoto__image deltaphoto__image--before"
        src={before}
        alt={beforeAlt}
        draggable={false}
      />
      {showLabels && (
        <div className="deltaphoto__labels" aria-hidden="true">
          <span className="deltaphoto__label deltaphoto__label--before">
            {beforeLabel}
          </span>
          <span className="deltaphoto__label deltaphoto__label--after">
            {afterLabel}
          </span>
        </div>
      )}
      <div className="deltaphoto__handle" aria-hidden="true">
        <span className="deltaphoto__line" />
        <span className="deltaphoto__thumb">
          <svg
            className="deltaphoto__grip"
            viewBox="0 0 101 162"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="20" fill="currentColor" />
            <circle cx="81" cy="20" r="20" fill="currentColor" />
            <circle cx="20" cy="81" r="20" fill="currentColor" />
            <circle cx="81" cy="81" r="20" fill="currentColor" />
            <circle cx="20" cy="142" r="20" fill="currentColor" />
            <circle cx="81" cy="142" r="20" fill="currentColor" />
          </svg>
        </span>
      </div>
      <input
        className="deltaphoto__range"
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={currentPosition}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onChange={(event) => handleChange(Number(event.currentTarget.value))}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-valuetext={`${Math.round(currentPosition)}% before image visible`}
      />
    </div>
  );
}
