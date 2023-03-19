import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

type PropsWithoutAutoplay = {
  autoPlay?: false;
  gap?: number;
  paddingX?: number;
  hideControls?: boolean;
  batchScroll?: boolean;
};
type PropsWithAutoplay = {
  autoPlay: true;
  interval: number;
};
type CommonProps = {
  gap?: number;
  paddingX?: number;
  hideControls?: boolean;
  batchScroll?: boolean;
  children: React.ReactNode;
};

export default function Carousel(
  props: (PropsWithoutAutoplay | PropsWithAutoplay) & CommonProps
) {
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [containerRef, containerBounds] = useMeasure();
  const [childRef, childBounds] = useMeasure();

  // convert incominmg children to list of items
  const ITEMS = useMemo<React.ReactNode[]>(() => {
    if (Array.isArray(props.children)) {
      return props.children.map((child) => child);
    } else {
      return [props.children];
    }
  }, [props.children]);

  // define values
  const parentWidth = containerBounds.width;
  const childWidth = childBounds.width;

  const gap = useMemo(() => props.gap || 10, []);
  const paddingX = useMemo(() => props.paddingX || gap, []);

  const SCALE_FACTOR = useMemo(() => 1.1, []);
  const ITEMS_IN_VIEW = useMemo(
    () =>
      Math.floor(
        (parentWidth - paddingX * 2 + gap * 2) / (childWidth + gap * 4)
      ),
    [parentWidth, childWidth]
  );

  useEffect(() => {
    const current = Math.floor(activeCardIdx / ITEMS_IN_VIEW);
    const prev = Math.floor((activeCardIdx - 1) / ITEMS_IN_VIEW);
    const next = Math.floor((activeCardIdx + 1) / ITEMS_IN_VIEW);
    let amt = 0;
    if (props.batchScroll) {
      if (current === prev) {
        amt = amt =
          -(childWidth + paddingX * 2 + gap * 2) * prev * ITEMS_IN_VIEW;
      } else if (current === next) {
        amt = -(childWidth + paddingX * 2 + gap * 2) * current * ITEMS_IN_VIEW;
      }
    } else {
      amt =
        activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
          ? -(childWidth + paddingX * 2 + gap * 2) * activeCardIdx
          : 0;
    }
    setScrollAmount(amt);
  }, [activeCardIdx]);

  useEffect(() => {
    if (!props.autoPlay || !props.interval) return;
    const selfIncTimerInterval = setInterval(() => {
      setActiveCardIdx((prevCardIdx) => {
        return prevCardIdx + 1 >= ITEMS.length ? 0 : prevCardIdx + 1;
      });
    }, props.interval);
    return () => {
      clearInterval(selfIncTimerInterval);
    };
  }, []);

  return (
    <div className="w-full grid items-center " ref={containerRef}>
      <div className="w-full grid items-center">
        <div
          id="carousel-wrapper"
          className="flex gap-10 px-10 overflow-x-hidden py-5"
        >
          {ITEMS.map((item, idx) => (
            <AnimatePresence key={`carousel-item-${idx}`}>
              <motion.div
                ref={childRef}
                className="flex-1"
                initial={{
                  scale: 1,
                }}
                animate={{
                  scale: idx === activeCardIdx ? 1 * SCALE_FACTOR : 1,
                  x: scrollAmount,
                }}
              >
                {item}
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
        {!props.hideControls && (
          <>
            <div className="flex w-full justify-center gap-2 w-1/5 mt-5">
              <button
                onClick={() => {
                  setActiveCardIdx((prevCardIdx) => {
                    return prevCardIdx - 1 < 0
                      ? ITEMS.length - 1
                      : prevCardIdx - 1;
                  });
                }}
                className="p-2 w-1/5 bg-black text-white hover:bg-neutral-600 transition"
              >
                {"<"}
              </button>
              <button
                onClick={() => {
                  setActiveCardIdx((prevCardIdx) => {
                    return prevCardIdx + 1 >= ITEMS.length
                      ? 0
                      : prevCardIdx + 1;
                  });
                }}
                className="p-2 w-1/5 bg-black text-white hover:bg-neutral-600 transition"
              >
                {">"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
