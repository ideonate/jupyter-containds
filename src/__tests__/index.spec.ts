// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { UserModel } from '..';

describe('User', () => {
  describe('UserModel', () => {
    it('should be createable', () => {
      const model = createTestModel(UserModel);
      expect(model).toBeInstanceOf(UserModel);
      expect(model.get('attrs')).to.be.empty();
      expect(model.get('name')).to.be(null);
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
