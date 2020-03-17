import {
  set, reset, httpGet
} from '../../lib/index';

jest.mock('axios', () => (
  () => Promise.resolve({
    data: {
      code: 0,
      data: {
        id: 'test'
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {}
  })
));

afterAll(() => {
  jest.clearAllMocks();
});

describe('test transformParams', () => {
  beforeEach(() => {
    reset();
  });

  test('method config setting should be override the global config', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      if (config.url === 'https://test1') {
        expect(config.params.global).not.toBeDefined();
      }
      if (config.url === 'https://test2') {
        expect(config.params.global).toBe(true);
      }
    }
    set({
      transformParams: {
        common: [(url, param) => {
          if (param.id === 'test') { param.global = true; }
          return [url, param];
        }]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://test1', orgParams, {
      transformParams: []
    });
    await httpGet('https://test2', orgParams);
  });

  test('method config setting can be set false', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      if (config.url === 'https://test1') {
        expect(config.params.global).not.toBeDefined();
      }
      if (config.url === 'https://test2') {
        expect(config.params.global).toBe(true);
      }
    }
    set({
      transformParams: {
        common: [(url, param) => {
          if (param.id === 'test') { param.global = true; }
          return [url, param];
        }]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://test1', orgParams, {
      transformParams: false
    });
    await httpGet('https://test2', orgParams);
  });

  test('method config setting must be set array', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      if (config.url === 'https://test1') {
        expect(config.params.global).not.toBeDefined();
      }
      if (config.url === 'https://test2') {
        expect(config.params.global).not.toBeDefined();
        expect(config.params.custom).toBe(true);
      }
    }
    const callFn = jest.fn();
    set({
      transformParams: {
        common: [(url, param) => {
          param.global = true;
          return [url, param];
        }]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });

    try {
      await httpGet('https://test1', orgParams, {
        transformParams: {}
      });
    } catch (err) {
      callFn();
      expect(err.message).toStrictEqual('method transformParams must be Array');
    }
    expect(callFn).toBeCalled();
    await httpGet('https://test2', orgParams, {
      transformParams: [(url, param) => {
        param.custom = true;
        return [url, param];
      }]
    });
  });
});
