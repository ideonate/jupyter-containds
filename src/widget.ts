// Copyright (c) Ideonate
// Distributed under the terms of the Modified BSD License.

import { DOMWidgetModel, ISerializers } from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

/**
 * User model
 */
export class UserModel extends DOMWidgetModel {
  defaults(): any {
    return {
      ...super.defaults(),
      _model_name: UserModel.model_name,
      _model_module: UserModel.model_module,
      _model_module_version: UserModel.model_module_version,
      _view_name: UserModel.view_name,
      _view_module: UserModel.view_module,
      _view_module_version: UserModel.view_module_version,
      attrs: {},
      name: null,
    };
  }

  /**
   * Constructor
   *
   * Initializes a WidgetModel instance. Called by the Backbone constructor.
   *
   * Parameters
   * ----------
   * widget_manager : WidgetManager instance
   * model_id : string
   *      An ID unique to this model.
   * comm : Comm instance (optional)
   */
  initialize(
    attributes: Backbone.ObjectHash,
    options: { model_id: string; comm?: any; widget_manager: any }
  ): void {
    super.initialize(attributes, options);

    // Get information for dashboard in hub context
    fetch('/hub/dashboards-api/hub-info/user', {
      mode: 'no-cors',
      credentials: 'same-origin',
      headers: new Headers({ 'Access-Control-Allow-Origin': '*' }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.set('attrs', json);
        this.set('name', json.name);
        this.save_changes();
      })
      .catch((reason) => {
        this.set('attrs', {});
        this.set('name', '');
        this.save_changes();
        console.error('Failed to fetch dashboard user metadata.', reason);
      });
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
  };

  static model_name = 'UserModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name: string | null = null; // Set to null if no view
  static view_module: string | null = null; // Set to null if no view
  static view_module_version = '';
}
