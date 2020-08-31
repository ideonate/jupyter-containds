import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, ToolbarButton } from '@jupyterlab/apputils';
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IMainMenu } from '@jupyterlab/mainmenu';
import {
  INotebookModel,
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';
import { CommandRegistry } from '@lumino/commands';
import { ReadonlyJSONObject } from '@lumino/coreutils';
import { IDisposable } from '@lumino/disposable';

const CONTAINDS_ICON_CLASS = 'jp-MaterialIcon cds-dashboard-icon';

/**
 * The command IDs used by the plugin.
 */
export namespace CommandIDs {
  export const containdsOpen = 'notebook:open-with-containds';
}

/**
 * A notebook widget extension that adds a voila preview button to the toolbar.
 */
class ContainDSOpenButton
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Instantiate a new VoilaRenderButton.
   * @param commands The command registry.
   */
  constructor(commands: CommandRegistry) {
    this._commands = commands;
  }

  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel): IDisposable {
    const button = new ToolbarButton({
      className: 'containdsOpen',
      tooltip: 'Deploy as a ContainDS Dashboard',
      iconClass: CONTAINDS_ICON_CLASS,
      iconLabel: 'Dashboard',
      onClick: (): void => {
        this._commands.execute(CommandIDs.containdsOpen);
      }
    });
    panel.toolbar.insertAfter('cellType', 'containdsOpen', button);
    return button;
  }

  private _commands: CommandRegistry;
}

/**
 * Initialization data for the jupyterlab-voila extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@ideonate/jupyter-containds:plugin',
  autoStart: true,
  requires: [JupyterFrontEnd.IPaths, INotebookTracker],
  optional: [ICommandPalette, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    paths: JupyterFrontEnd.IPaths,
    notebooks: INotebookTracker,
    palette: ICommandPalette | null,
    menu: IMainMenu | null
  ) => {
    const { commands, docRegistry } = app;
    const hubHost = paths.urls.hubHost || '';
    const hubPrefix = paths.urls.hubPrefix || '';

    // Bail if not running on JupyterHub.
    if (!hubPrefix) {
      return;
    } else {
      console.debug('hub-extension: Found configuration ', {
        hubHost: hubHost,
        hubPrefix: hubPrefix
      });
    }

    const newDashboardURL = hubHost + URLExt.join(hubPrefix, 'dashboards-new');

    function getCurrent(args: ReadonlyJSONObject): NotebookPanel | null {
      const widget = notebooks.currentWidget;
      const activate = args['activate'] !== false;

      if (activate && widget) {
        app.shell.activateById(widget.id);
      }

      return widget;
    }

    function isEnabled(): boolean {
      return (
        notebooks.currentWidget !== null &&
        notebooks.currentWidget === app.shell.currentWidget
      );
    }

    function getDashboardUrl(path: string): string {
      return (
        newDashboardURL +
        URLExt.objectToQueryString({
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_path: path,
          name: PathExt.basename(path, '.ipynb').replace('_', ' ')
        })
      );
    }

    commands.addCommand(CommandIDs.containdsOpen, {
      label: 'New ContainDS Dashboard',
      caption: 'Create as a ContainDS Dashboard in New Browser Tab',
      execute: async args => {
        const current = getCurrent(args);
        if (!current) {
          return;
        }
        await current.context.save();
        const dashboardUrl = getDashboardUrl(current.context.path);
        window.open(dashboardUrl, '_blank');
      },
      isEnabled
    });

    if (palette) {
      const category = 'Notebook Operations'; // Same category as Voilà
      palette.addItem({ command: CommandIDs.containdsOpen, category });
    }

    if (menu && menu.viewMenu) {
      menu.viewMenu.addGroup(
        [
          {
            command: CommandIDs.containdsOpen
          }
        ],
        1001
      );
    }

    const dashboardButton = new ContainDSOpenButton(commands);
    docRegistry.addWidgetExtension('Notebook', dashboardButton);
  }
};

export default extension;
