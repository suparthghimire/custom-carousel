import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

type PropsWithoutAutoplay = {
  autoPlay?: false;
  hideControls?: boolean;
  batchScroll?: boolean;
};
type PropsWithAutoplay = {
  autoPlay: true;
  interval: number;
};
type CommonProps = {
  spacing?: number;
  hideControls?: boolean;
  batchScroll?: boolean;
  scaleOnHover?: boolean;
  children: React.ReactNode;
  pagination?: boolean;
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

  const spacing = useMemo(() => props.spacing || 10, []);

  // if 10 spacing is 40px, then 1 spacing is 4px . SO formula is 4 * spacing

  const SCALE_FACTOR = useMemo(() => 1.1, []);
  const ITEMS_IN_VIEW = useMemo(
    () => Math.floor((parentWidth - spacing * 4) / (childWidth + spacing * 4)),
    [parentWidth, childWidth]
  );

  const current = Math.floor(activeCardIdx / ITEMS_IN_VIEW);
  const prev = Math.floor((activeCardIdx - 1) / ITEMS_IN_VIEW);
  const next = Math.floor((activeCardIdx + 1) / ITEMS_IN_VIEW);

  useEffect(() => {
    let amt = 0;
    if (props.batchScroll) {
      if (current === prev)
        amt = -(childWidth + spacing * 4) * prev * ITEMS_IN_VIEW;
      else if (current === next)
        amt = -(childWidth + spacing * 4) * current * ITEMS_IN_VIEW;
      else
        amt =
          activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
            ? -(childWidth + spacing * 4) * activeCardIdx
            : 0;
    } else {
      amt =
        activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
          ? -(childWidth + spacing * 4) * activeCardIdx
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
          className={`flex overflow-x-hidden py-5`}
          style={{
            gap: `${spacing * 4}px`,
            paddingLeft: `${spacing * 4}px`,
            paddingRight: `${spacing * 4}px`,
          }}
        >
          {ITEMS.map((item, idx) => (
            <AnimatePresence key={`carousel-item-${idx}`}>
              <motion.div
                ref={childRef}
                className="flex-1"
                initial={{
                  scale: 1,
                }}
                whileHover={{
                  scale:
                    activeCardIdx === idx
                      ? SCALE_FACTOR
                      : props.scaleOnHover
                      ? SCALE_FACTOR
                      : 1,
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

        <div className="w-full grid place-items-center">
          {props.pagination && (
            <div className="mt-5 h-full flex gap-2">
              {ITEMS.map((_, idx) => (
                <button
                  onClick={() => {
                    setActiveCardIdx(idx);
                  }}
                  key={`pagination-carousel-${idx}`}
                  className={`w-[10px] h-[10px] ${
                    idx === activeCardIdx ? "bg-neutral-900" : "bg-neutral-300"
                  } rounded-full`}
                />
              ))}
            </div>
          )}
        </div>
        <>
          {!props.hideControls && (
            <div className="flex w-full justify-center spacing-2 w-1/5 mt-5">
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
          )}
        </>
      </div>
    </div>
  );
}
