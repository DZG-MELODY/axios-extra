import {
  set, reset, httpGet, interceptors
} from '../../../lib/index';


describe('test interceptors setToken', () => {
  beforeEach(() => {
    reset();
    localStorage.clear();
  });

  test('config headers should be add authorization after interceptor', async () => {
    const orgParams = { id: 'test' };

    localStorage.setItem('token', '123456');

    expect.assertions(1);

    const expectCallback = jest.fn((response) => {
      expect(response.config.headers.Authorization).toBe('123456');
    });

    set({
      interceptors: {
        request: [
          interceptors.request.setToken
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
