import { set, reset, httpGet } from '../../lib/index';


describe('test axios config', () => {
  beforeEach(() => {
    reset();
  });

  test('axios origin config should be supported', async () => {
    const orgParams = { id: 'test' };

    expect.assertions(1);

    const authHeader = `Basic ${btoa('sst-fe:123456a')}`;

    const expectCallback = jest.fn((response) => {
      /* eslint-disable-next-line */
      expect(response.request._headers.authorization).toBe(authHeader);
    });

    set({
      auth: {
        username: 'sst-fe',
        password: '123456a'
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
