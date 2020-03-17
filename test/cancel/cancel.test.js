import { set, reset, httpGet } from '../../lib/index';

describe('test http cancel', () => {
  beforeEach(() => {
    reset();
  });

  test('cancel hooks should be called', () => {
    const orgParams = { id: 'test', status: 200, statusText: 'OK' };
    const requestCancel = jest.fn();
    expect.assertions(2);
    set({
      hooks: {
        response: {
          requestCancel
        }
      }
    });

    const request = httpGet('https://jsonplaceholder.typicode.com/users', orgParams, {
      canCancel: true
    });

    process.nextTick(() => {
      request.cancel();
    });

    return request.catch((err) => {
      expect(requestCancel).toBeCalled();
      expect(err.isCancel).toBe(true);
    });
  });

  test('reject err should has isCancel field and message is equal to trigger input', () => {
    const orgParams = { id: 'test', status: 200, statusText: 'OK' };
    expect.assertions(2);

    const request = httpGet('https://jsonplaceholder.typicode.com/users', orgParams, {
      canCancel: true
    });

    process.nextTick(() => {
      request.cancel('test cancel');
    });

    return request.catch((err) => {
      expect(err.isCancel).toBe(true);
      expect(err.message).toBe('test cancel');
    });
  });
});
