// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { UserModel } from '..';

describe('User', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      body: '{}',
      json: () => {
        return {};
      },
    } as any);
  });

  describe('UserModel', () => {
    it('should be createable', () => {
      const model = createTestModel(UserModel);
      expect(model).toBeInstanceOf(UserModel);
      expect(Object.keys(model.get('attrs'))).toHaveLength(0);
      expect(model.get('name')).toBeNull();
    });

    it('should be createable with a value', () => {
      const state = { attrs: { name: 'username' }, name: 'username' };
      const model = createTestModel(UserModel, state);
      expect(model).toBeInstanceOf(UserModel);
      expect(model.get('attrs').name).toEqual('username');
      expect(model.get('name')).toEqual('username');
    });
  });
});
