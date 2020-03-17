import {
  set, reset, httpGet
} from '../../lib/index';

jest.mock('axios', () => (
  (config) => (
    Promise.resolve({
      data: config.params.data,
      status: config.params.status || 200,
      statusText: config.params.statusText || 'OK',
      headers: {},
      config,
      request: {}
    })
  )
));

afterAll(() => {
  jest.clearAllMocks();
});

describe('test hooks', () => {
  beforeEach(() => {
    reset();
  });

  test('inline hooks should be called', async () => {
    const orgParamsNoExist = { id: 'test', status: 404, statusText: 'noExist' };
    const orgParamsTokenExpire = {
      id: 'test',
      data: {
        code: 50001001,
        data: {}
      }
    };

    const beforeSend = jest.fn((config) => {
      expect(config).toBeDefined();
    });

    const tokenExpire = jest.fn((response) => {
      expect(response.status).toBeDefined();
      expect(response.data).toBeDefined();
      expect([50001001, 50001006, 50001005].indexOf(response.data.code)).toBeGreaterThanOrEqual(0);
    });

    const interfaceNoExist = jest.fn((response) => {
      expect(response.status).toBe(404);
    });

    set({
      hooks: {
        request: {
          beforeSend
        },
        response: {
          tokenExpire,
          interfaceNoExist
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParamsNoExist);
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParamsTokenExpire);

    expect(beforeSend).toBeCalled();
    expect(tokenExpire).toBeCalled();
    expect(interfaceNoExist).toBeCalled();
  });

  test('custom hooks should be called', async () => {
    const orgParamsCustom = {
      id: 'test',
      data: {
        code: 100,
        data: []
      }
    };

    const customCallbackNoName = jest.fn();

    const customReqCallback = jest.fn();
    const customReqTrigger = (config) => !!config.params;

    const customCallbackCode = jest.fn();
    const customTriggerCode = (response) => response.data.code === 100;
    const customCallbackData = jest.fn();
    const customTriggerData = (response) => Array.isArray(response.data.data);

    set({
      hooks: {
        request: {
          customCallbackNoName,
          hasParams: {
            trigger: customReqTrigger,
            callback: customReqCallback
          }
        },
        response: {
          codeEqual100: {
            trigger: customTriggerCode,
            callback: customCallbackCode
          },
          dataIsArray: {
            trigger: customTriggerData,
            callback: customCallbackData
          }
        }
      }
    });

    await httpGet('https://jsonplaceholder.typicode.com/users', orgParamsCustom);

    expect(customCallbackNoName).toBeCalled();
    expect(customReqCallback).toBeCalled();
    expect(customCallbackCode).toBeCalled();
    expect(customCallbackData).toBeCalled();
  });
});

describe('invalidate hook config should throw an error', () => {
  beforeEach(() => {
    reset();
  });

  test('invalidate request hook trigger and callback config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          request: {
            hasParams: {
              trigger: undefined,
              callback() {}
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('hook [hasParams] config is invalidate');
    }
  });

  test('invalidate request hook trigger config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          request: {
            hasParams: {
              trigger: 'test',
              callback() {}
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('trigger of hook is not a function');
    }
  });

  test('invalidate request hook callback config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          request: {
            hasParams: {
              trigger() {},
              callback: 'test'
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('callback of hook is not a function');
    }
  });

  test('invalidate response hook trigger and callback config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          response: {
            hasParams: {
              trigger: undefined,
              callback() {}
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('hook [hasParams] config is invalidate');
    }
  });

  test('invalidate response hook trigger config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          response: {
            hasParams: {
              trigger: 'test',
              callback() {}
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('trigger of hook is not a function');
    }
  });

  test('invalidate response hook callback config should throw an error', async () => {
    expect.assertions(1);
    try {
      set({
        hooks: {
          response: {
            hasParams: {
              trigger() {},
              callback: 'test'
            }
          }
        }
      });
    } catch (err) {
      expect(err.message).toBe('callback of hook is not a function');
    }
  });
});
