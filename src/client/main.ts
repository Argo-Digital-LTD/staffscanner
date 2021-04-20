import 'vite/dynamic-import-polyfill';
import throttle from 'lodash.throttle';
import './css/index.css';
import './css/inter.css';
import 'alpinejs';

declare global {
  interface Window {
    createObserver: (
      element: HTMLElement,
      threshold: number,
      callbackIn: () => unknown,
      callbackOut: () => unknown,
    ) => void;
    onScroll: (
      offset: number,
      threshold: number,
      callbackIn: () => unknown,
      callbackOut: () => unknown,
      current: boolean,
    ) => void;
  }
}

let scrollPosition = 0;

const scrollCallback = (_e: Event) => {
  scrollPosition = window.scrollY;
};

window.addEventListener('scroll', throttle(scrollCallback, 200));

export const createObserver = (
  element: HTMLElement,
  threshold: number,
  callbackIn: () => unknown,
  callbackOut: () => unknown,
) => {
  let observer;

  if (!threshold) {
    // set default value
    threshold = 0.5;
  }

  const config = {
    rootMargin: '50px 20px 75px 30px',
    threshold,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting ||
        entry.boundingClientRect.top < scrollPosition
      ) {
        callbackIn();
        // console.log('in the view', entry.intersectionRatio);
      } else {
        callbackOut();
        // console.log('out of view');
      }
    });
  }, config);

  observer.observe(element);
};

window.createObserver = createObserver;

export const onScroll = (
  offset: number,
  threshold: number,
  callbackIn: () => unknown,
  callbackOut: () => unknown,
  current: boolean,
) => {
  if (offset > threshold && current === false) {
    callbackIn();
  } else if (offset < threshold && current === true) {
    callbackOut();
  }
};

window.onScroll = onScroll;
