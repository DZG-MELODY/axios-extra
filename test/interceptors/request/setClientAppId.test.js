import {
  set, reset, httpGet, interceptors
} from '../../../lib/index';


describe('test interceptors setClientAppId', () => {
  const originWarn = console.warn;

  beforeEach(() => {
    reset();
    delete window.config;
  });

  afterAll(() => {
    console.warn = originWarn;
  });

  test('config headers should be add Client-App-Id after interceptor', async () => {
    const orgParams = { id: 'test' };

    window.config = {
      globalConfig: {
        clientAppId: '123456'
      }
    };

    expect.assertions(1);

    const expectCallback = jest.fn((response) => {
      expect(response.config.headers['Client-App-Id']).toBe('123456');
    });

    set({
      interceptors: {
        request: [
          interceptors.request.setClientAppId
        ]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('config headers should be add Client-App-Id even if clientAppId is empty value', async () => {
    const orgParams = { id: 'test' };

    window.config = {
      globalConfig: {
        clientAppId: ''
      }
    };

    expect.assertions(1);

    const expectCallback = jest.fn((response) => {
      expect(response.config.headers['Client-App-Id']).toBe('');
    });

    set({
      interceptors: {
        request: [
          interceptors.request.setClientAppId
        ]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('warn should console if window.config is undefined', async () => {
    const orgParams = { id: 'test' };
    expect.assertions(2);
    const consoleOutput = jest.fn((message) => {
      expect(message).toBe('[megvii-http] (interceptor) no globalConfig to get client-app-id');
    });
    console.warn = consoleOutput;

    const expectCallback = jest.fn((response) => {
      expect(response.config.headers['Client-App-Id']).not.toBeDefined();
    });

    set({
      interceptors: {
        request: [
          interceptors.request.setClientAppId
        ]
      },
      hooks: {
        response: {
          expectCallback
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });
});
