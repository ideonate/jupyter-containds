// Copyright (c) Ideonate
// Distributed under the terms of the Modified BSD License.
import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { labUIExtension } from './labui';
import { MODULE_NAME, MODULE_VERSION } from './version';
import * as widgetExports from './widget';

const EXTENSION_ID = '@ideonate/jupyter-containds:widgets';

/**
 * Activate the widget extension.
 */
function activateWidgetExtension(
  app: JupyterFrontEnd,
  registry: IJupyterWidgetRegistry
): void {
  registry.registerWidget({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    exports: widgetExports,
  });
}

/**
 * The widget plugin.
 */
const widgetsPlugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry as any],
  activate: activateWidgetExtension,
  autoStart: true,
};

export default [widgetsPlugin, labUIExtension];
