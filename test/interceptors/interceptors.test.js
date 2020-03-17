import {
  set, interceptors
} from '../../lib/index';

jest.mock('axios', () => (
  {
    interceptors: {
      request: {},
      response: {}
    }
  }
));

afterAll(() => {
  jest.clearAllMocks();
});

describe('broken axios can not add interceptors', () => {
  test('interceptors can not add', () => {
    try {
      set({
        interceptors: {
          request: [
            interceptors.request.setToken
          ]
        }
      });
    } catch (error) {
      expect(error.message).toBe('axios instance has no use method, it may be broken');
    }
  });
});
