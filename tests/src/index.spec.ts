// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import expect = require('expect.js');
// Add any needed widget imports here (or from controls)
// import '@jupyter-widgets/base';

import { createTestModel } from './utils.spec';

import { UserModel } from '../../src';

describe('User', () => {
  describe('UserModel', () => {
    it('should be createable', () => {
      let model = createTestModel(UserModel);
      expect(model).to.be.an(UserModel);
      expect(model.get('attrs')).to.be.empty();
      expect(model.get('name')).to.be(null);
    });

    it('should be createable with a value', () => {
      let state = { attrs: { name: 'username' }, name: 'username' };
      let model = createTestModel(UserModel, state);
      expect(model).to.be.an(UserModel);
      expect(model.get('attrs').name).to.be('username');
      expect(model.get('name')).to.be('username');
    });
  });
});
