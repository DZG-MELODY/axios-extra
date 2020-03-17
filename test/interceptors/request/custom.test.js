import { set, reset, httpGet } from '../../../lib/index';


describe('test interceptors custom', () => {
  beforeEach(() => {
    reset();
  });

  test('config params should be add addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(2);

    const expectCallback = jest.fn((response) => {
      expect(response.config.params.addInterceptor).toBe(true);
    });
    const interceptorResolveFn = jest.fn((config) => {
      config.params.addInterceptor = true;
      return config;
    });

    set({
      interceptors: {
        request: [{ resolve: interceptorResolveFn }]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });

    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);

    expect(interceptorResolveFn).toBeCalled();
  });

  test('config params should be add selfInterceptor instead of addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(4);

    const expectCallback = jest.fn((response) => {
      expect(response.config.params.addInterceptor).not.toBeDefined();
      expect(response.config.params.selfInterceptor).toBe(true);
    });

    const addInterceptorResolveFn = jest.fn((config) => {
      config.params.addInterceptor = true;
      return config;
    });

    const selfInterceptorResolveFn = jest.fn((config) => {
      config.params.selfInterceptor = true;
      return config;
    });

    set({
      interceptors: {
        request: [{ resolve: addInterceptorResolveFn }]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });

    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams, {
      interceptors: {
        merge: false,
        request: [selfInterceptorResolveFn]
      }
    });

    expect(addInterceptorResolveFn).not.toBeCalled();
    expect(selfInterceptorResolveFn).toBeCalled();
  });

  test('config params should be add selfInterceptor and addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(4);

    const expectCallback = jest.fn((response) => {
      expect(response.config.params.addInterceptor).toBe(true);
      expect(response.config.params.selfInterceptor).toBe(true);
    });

    const addInterceptorResolveFn = jest.fn((config) => {
      config.params.addInterceptor = true;
      return config;
    });

    const selfInterceptorResolveFn = jest.fn((config) => {
      config.params.selfInterceptor = true;
      return config;
    });

    set({
      interceptors: {
        request: [{ resolve: addInterceptorResolveFn }]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });

    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams, {
      interceptors: {
        merge: true,
        request: [selfInterceptorResolveFn]
      }
    });

    expect(addInterceptorResolveFn).toBeCalled();
    expect(selfInterceptorResolveFn).toBeCalled();
  });
});
