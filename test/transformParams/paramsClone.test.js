import {
  set, reset, transformParams, httpGet, httpPost, httpPut
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

describe('test paramsClone', () => {
  beforeEach(() => {
    reset();
  });

  test('params after clone should be not equal to input params', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      expect(config.params).not.toBe(orgParams);
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });


  test('FormData should not be clone by paramsClone transform', async () => {
    const orgParams = new FormData();
    function beforeSend(config) {
      expect(config.data).toBe(orgParams);
    }

    set({
      transformParams: {
        post: [transformParams.paramsClone]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });

    await httpPost('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('set specific method transform should not effect other method', async () => {
    const orgPostParams = { id: 'test', method: 'post' };
    const orgPutParams = { id: 'test', method: 'put' };
    const beforeSend = jest.fn((config) => {
      if (config.data.method === 'post') {
        expect(config.data).not.toBe(orgPostParams);
      } else if (config.data.method === 'put') {
        expect(config.data).toBe(orgPutParams);
      }
    });

    set({
      transformParams: {
        post: [transformParams.paramsClone]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpPost('https://jsonplaceholder.typicode.com/users', orgPostParams);
    const ret = await httpPut('https://jsonplaceholder.typicode.com/posts/1', orgPutParams);
    expect(beforeSend.mock.calls.length).toBe(2);
    // mock
    expect(ret.code).toBe(0);
  });
});
