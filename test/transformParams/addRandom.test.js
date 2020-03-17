import {
  set, reset, transformParams, httpGet
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

describe('test addRandom', () => {
  const originLog = console.log;
  const originWarn = console.warn;
  const originError = console.error;

  beforeEach(() => {
    reset();
  });

  afterAll(() => {
    console.log = originLog;
    console.warn = originWarn;
    console.error = originError;
  });

  test('params should be add r field after addRandom', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      expect(config.params.r).toBeDefined();
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, transformParams.addRandom]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('params which contains r field should console warning after addRandom', async () => {
    const consoleOutput = jest.fn((message) => {
      expect(message).toBe('[megvii-http] (transformParams) random params r has exist in params object');
    });
    console.warn = consoleOutput;
    const orgParams = { id: 'test', r: 'random' };
    function beforeSend(config) {
      expect(config.params.r).toBeDefined();
      expect(config.params.r).toBe('random');
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, transformParams.addRandom]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
    expect(consoleOutput).toBeCalled();
  });
});
