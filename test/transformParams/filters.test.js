import {
  set, reset, transformParams, httpGet
} from '../../lib/index';

const { filters, createFilter } = transformParams.paramsFilter;

jest.mock('axios', () => (
  () => (Promise.resolve({
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
  }))
));

afterAll(() => {
  jest.clearAllMocks();
});

describe('test filters', () => {
  beforeEach(() => {
    reset();
  });

  test('empty string should be remove from params after filterEmptyString', async () => {
    const orgParams = {
      id: 'test',
      str: '',
      sub: {
        num: 100,
        str: ''
      }
    };
    function beforeSend(config) {
      expect(config.params.str).not.toBeDefined();
      expect(config.params.sub).toBeDefined();
      expect(config.params.sub.str).not.toBeDefined();
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, filters.filterEmptyString]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('empty array should be remove from params after filterEmptyArray', async () => {
    const orgParams = {
      id: 'test',
      str: '',
      array: [],
      sub: {
        num: 100,
        str: '',
        array: []
      }
    };
    function beforeSend(config) {
      expect(config.params.array).not.toBeDefined();
      expect(config.params.sub).toBeDefined();
      expect(config.params.sub.num).toBeDefined();
      expect(config.params.sub.str).toBeDefined();
      expect(config.params.sub.array).not.toBeDefined();
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, filters.filterEmptyArray]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('empty field should be remove from params after filterEmptyAny', async () => {
    const orgParams = {
      id: 'test',
      num: 0,
      emptyStr: '',
      nullValue: null,
      undefValue: undefined,
      emptyArray: [],
      bool: false,
      sub: {
        num: 100,
        emptyStr: '',
        nullValue: null,
        undefValue: undefined,
        emptyArray: [],
        bool: false
      }
    };
    function beforeSend(config) {
      expect(config.params.emptyStr).not.toBeDefined();
      expect(config.params.nullValue).not.toBeDefined();
      expect(config.params.undefValue).not.toBeDefined();
      expect(config.params.emptyArray).not.toBeDefined();
      expect(config.params.bool).toBeDefined();
      expect(config.params.num).toBeDefined();
      expect(config.params.sub).toBeDefined();
      expect(config.params.sub.num).toBeDefined();
      expect(config.params.sub.bool).toBeDefined();
      expect(config.params.sub.emptyStr).not.toBeDefined();
      expect(config.params.sub.nullValue).not.toBeDefined();
      expect(config.params.sub.undefValue).not.toBeDefined();
      expect(config.params.sub.emptyArray).not.toBeDefined();
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, filters.filterEmptyAny]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('falsy field should be remove from params after filterFalsy', async () => {
    const orgParams = {
      id: 'test',
      num: 0,
      emptyStr: '',
      nullValue: null,
      undefValue: undefined,
      emptyArray: [],
      bool: false,
      sub: {
        num: 0,
        emptyStr: '',
        nullValue: null,
        undefValue: undefined,
        emptyArray: [],
        bool: false
      }
    };
    function beforeSend(config) {
      expect(config.params.emptyStr).not.toBeDefined();
      expect(config.params.nullValue).not.toBeDefined();
      expect(config.params.undefValue).not.toBeDefined();
      expect(config.params.num).not.toBeDefined();
      expect(config.params.bool).not.toBeDefined();
      expect(config.params.emptyArray).toBeDefined();
      expect(config.params.sub).toBeDefined();
      expect(config.params.sub.num).not.toBeDefined();
      expect(config.params.sub.bool).not.toBeDefined();
      expect(config.params.sub.emptyStr).not.toBeDefined();
      expect(config.params.sub.nullValue).not.toBeDefined();
      expect(config.params.sub.undefValue).not.toBeDefined();
      expect(config.params.sub.emptyArray).toBeDefined();
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, filters.filterFalsy]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('specific field should be remove from params after custom filters', async () => {
    const orgParams = {
      id: 'test',
      num: 0,
      invalidateNum: 100,
      emptyContentStr: '  ',
      emptyStr: '',
      notANum: NaN,
      infiniteValue: 1 / 0,
      nullValue: null,
      undefValue: undefined,
      emptyArray: [],
      bool: false,
      sub: {
        num: 0,
        invalidateNum: 100,
        emptyContentStr: '  ',
        emptyStr: '',
        notANum: NaN,
        infiniteValue: 1 / 0,
        nullValue: null,
        undefValue: undefined,
        emptyArray: [],
        bool: false
      }
    };
    function beforeSend(config) {
      expect(config.params.emptyStr).not.toBeDefined();
      expect(config.params.emptyContentStr).not.toBeDefined();
      expect(config.params.notANum).not.toBeDefined();
      expect(config.params.infiniteValue).not.toBeDefined();
      expect(config.params.nullValue).not.toBeDefined();
      expect(config.params.undefValue).not.toBeDefined();
      expect(config.params.num).toBeDefined();
      expect(config.params.invalidateNum).not.toBeDefined();
      expect(config.params.bool).toBeDefined();
      expect(config.params.emptyArray).not.toBeDefined();
      expect(config.params.sub).toBeDefined();
      expect(config.params.sub.num).toBeDefined();
      expect(config.params.sub.invalidateNum).not.toBeDefined();
      expect(config.params.sub.bool).toBeDefined();
      expect(config.params.sub.emptyStr).not.toBeDefined();
      expect(config.params.sub.emptyContentStr).not.toBeDefined();
      expect(config.params.sub.notANum).not.toBeDefined();
      expect(config.params.sub.infiniteValue).not.toBeDefined();
      expect(config.params.sub.nullValue).not.toBeDefined();
      expect(config.params.sub.undefValue).not.toBeDefined();
      expect(config.params.sub.emptyArray).not.toBeDefined();
    }

    // 自定义验证器和过滤器
    const customValidate = (value) => value === 100;
    const customFilter = createFilter(['emptyArray', 'null', 'undefined', 'NaN', 'infinite', 'emptyContent', customValidate]);

    set({
      transformParams: {
        common: [transformParams.paramsClone, customFilter]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('array params should not be filtered', async () => {
    const orgParams = [
      '',
      0,
      null,
      undefined,
      false,
      NaN,
      [],
      {
        num: 0,
        invalidateNum: 100,
        emptyContentStr: '  ',
        emptyStr: '',
        notANum: NaN,
        infiniteValue: 1 / 0,
        nullValue: null,
        undefValue: undefined,
        emptyArray: [],
        bool: false
      }
    ];

    function beforeSend(config) {
      expect(config.params[0]).toBeDefined();
      expect(config.params[1]).toBeDefined();
      expect(config.params[2]).toBeDefined();
      expect(config.params[3]).toBe(undefined);
      expect(config.params[4]).toBeDefined();
      expect(config.params[5]).toBeDefined();
      expect(config.params[6]).toBeDefined();
      expect(config.params[7]).toBeDefined();
    }

    set({
      transformParams: {
        common: [transformParams.paramsClone, transformParams.paramsFilter.filters.filterEmptyAny]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('primitive params should not be filtered', async () => {
    const orgParams = '';
    function beforeSend(config) {
      expect(config.params).toBeDefined();
      expect(config.params).toStrictEqual('');
    }
    set({
      transformParams: {
        common: [transformParams.paramsClone, transformParams.paramsFilter.filters.filterEmptyAny]
      },
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });
});
