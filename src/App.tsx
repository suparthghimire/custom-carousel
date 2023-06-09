import React from "react";
import Card from "./components/Card";
import Carousel from "./components/Carousel";
import { ITEMS } from "./utils/mockdata";

export default function App() {
  return (
    <div className="flex flex-col gap-10 p-10 overflow-y-hidden">
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Individual Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Pagination</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel pagination>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Scale on Hover</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel scaleOnHover>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Custom Spacing</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel spacing={20}>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Batch Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel batchScroll>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Automatic Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel pagination autoPlay interval={1000} hideControls>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Automatic Batch Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel batchScroll autoPlay interval={500} hideControls>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-neutral-200 py-5 rounded">{children}</div>;
}
