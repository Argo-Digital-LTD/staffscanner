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
    features: () => {
      state: 'web' | 'mobile';
      switchToMobile: () => void;
      getState: (state: 'web' | 'mobile') => boolean;
    };
    contactForm: () => {
      formData: {
        name: string;
        emailAddress: string;
        company: string;
        telephoneNo: string;
        message: string;
      };
    };
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
    threshold = 0;
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

const features = () => {
  return {
    state: 'web' as 'web' | 'mobile',
    switchToMobile() {
      this.state = 'mobile';
    },
    switchToWeb() {
      this.state = 'web';
    },
    getState(state: 'web' | 'mobile') {
      if (state === this.state) return true;
      return false;
    },
  };
};

window.features = features;

const contactForm = () => {
  return {
    formData: {
      name: '',
      emailAddress: '',
      company: '',
      telephoneNo: '',
      message: '',
    },
    loading: false,
    buttonLabel: 'Send message',
    message: '',
    send() {
      this.buttonLabel = 'Sending';
      this.loading = true;
      fetch('https://app.staffscanner.co.uk/v1/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData),
      })
        .then(() => {
          this.message =
            'We received your email, we will get back to you within 24 hours.';
        })
        .catch(() => {
          this.message =
            "That didn't work, please call us at 03300945922.";
        })
        .finally(() => {
          this.formData = {
            name: '',
            emailAddress: '',
            company: '',
            telephoneNo: '',
            message: '',
          };
          this.loading = false;
          this.buttonLabel = 'Send Message';
        });
    },
  };
};

window.contactForm = contactForm;
