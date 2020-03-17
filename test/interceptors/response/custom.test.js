import { set, reset, httpGet } from '../../../lib/index';

afterAll(() => {
  jest.clearAllMocks();
});

describe('test response interceptors custom', () => {
  beforeEach(() => {
    reset();
  });

  test('config params should be add addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(3);

    const expectCallback = jest.fn((response) => {
      expect(response.status).toBe(300);
      expect(response.statusText).toBe('redirect');
    });
    const interceptorResolveFn = jest.fn((response) => {
      response.status = 300;
      response.statusText = 'redirect';
      return response;
    });

    set({
      interceptors: {
        response: [{ resolve: interceptorResolveFn }]
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

  test('response should be effected by selfInterceptor instead of addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(5);

    const expectCallback = jest.fn((response) => {
      expect(response.status).not.toBe(300);
      expect(response.statusText).not.toBe('redirect');
      expect(response.data.id).toBe('self');
    });

    const addInterceptorResolveFn = jest.fn((response) => {
      response.status = 300;
      response.statusText = 'redirect';
      return response;
    });

    const selfInterceptorResolveFn = jest.fn((response) => {
      response.data = {
        id: 'self'
      };
      return response;
    });

    set({
      interceptors: {
        response: [{ resolve: addInterceptorResolveFn }]
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
        response: [selfInterceptorResolveFn]
      }
    });

    expect(addInterceptorResolveFn).not.toBeCalled();
    expect(selfInterceptorResolveFn).toBeCalled();
  });

  test('response should be effected by both selfInterceptor and addInterceptor after interceptor', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(5);

    const expectCallback = jest.fn((response) => {
      expect(response.status).toBe(300);
      expect(response.statusText).toBe('redirect');
      expect(response.data.id).toBe('self');
    });

    const addInterceptorResolveFn = jest.fn((response) => {
      response.status = 300;
      response.statusText = 'redirect';
      return response;
    });

    const selfInterceptorResolveFn = jest.fn((response) => {
      response.data = {
        id: 'self'
      };
      return response;
    });

    set({
      interceptors: {
        response: [{ resolve: addInterceptorResolveFn }]
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
        response: [selfInterceptorResolveFn]
      }
    });

    expect(addInterceptorResolveFn).toBeCalled();
    expect(selfInterceptorResolveFn).toBeCalled();
  });
});
