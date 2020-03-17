import megHttp from '../../lib/index';

describe('test httpMethod', () => {
  beforeEach(() => {
    megHttp.reset();
  });

  test('megHttp namespace function should be defined', () => {
    expect(megHttp).toBeDefined();
    expect(typeof megHttp).toBe('object');
    expect(typeof megHttp.set).toBe('function');
    expect(typeof megHttp.reset).toBe('function');
    expect(typeof megHttp.httpGet).toBe('function');
    expect(typeof megHttp.httpPost).toBe('function');
    expect(typeof megHttp.httpPut).toBe('function');
    expect(typeof megHttp.httpPatch).toBe('function');
    expect(typeof megHttp.httpDelete).toBe('function');
  });

  test('httpGet method set params of config', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      expect(config.params).toBe(orgParams);
      expect(config.params.id).toBe('test');
    }
    megHttp.set({
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await megHttp.httpGet('https://jsonplaceholder.typicode.com/users', orgParams);
  });

  test('httpPost method set data of config', async () => {
    const orgParams = { id: 'test' };
    function beforeSend(config) {
      expect(config.data).toBe(orgParams);
      expect(config.data.id).toBe('test');
    }
    megHttp.set({
      hooks: {
        request: {
          beforeSend
        }
      }
    });
    await megHttp.httpPost('https://jsonplaceholder.typicode.com/users', orgParams);
  });
});
