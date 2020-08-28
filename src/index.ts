import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, ToolbarButton } from '@jupyterlab/apputils';
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import {
  INotebookModel,
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';
import { CommandRegistry } from '@lumino/commands';
import { ReadonlyJSONObject } from '@lumino/coreutils';
import { IDisposable } from '@lumino/disposable';
import { requestAPI, ContainDS } from './request';

const CONTAINDS_ICON_CLASS = 'jp-MaterialIcon cds-dashboard-icon';

/**
 * The command IDs used by the plugin.
 */
export namespace CommandIDs {
  export const containdsCreate = 'notebook:open-with-containds';
  export const containdsOpen = 'containds:open-dashboard';
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
      className: 'containdsCreate',
      tooltip: 'Deploy as a ContainDS Dashboard',
      iconClass: CONTAINDS_ICON_CLASS,
      iconLabel: 'Dashboard',
      onClick: (): void => {
        this._commands.execute(CommandIDs.containdsCreate);
      }
    });
    panel.toolbar.insertAfter('cellType', 'containdsCreate', button);
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
  optional: [ICommandPalette, IMainMenu, ILauncher],
  activate: (
    app: JupyterFrontEnd,
    paths: JupyterFrontEnd.IPaths,
    notebooks: INotebookTracker,
    palette: ICommandPalette | null,
    menu: IMainMenu | null,
    launcher: ILauncher | null
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

    commands.addCommand(CommandIDs.containdsCreate, {
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

    commands.addCommand(CommandIDs.containdsOpen, {
      label: args => {
        if (args['owned']) {
          return args['name']
            ? `Edit '${args['name']}'`
            : 'Edit the ContainDS Dashboard';
        } else {
          return args['name']
            ? (args['name'] as string)
            : 'Open the ContainDS Dashboard';
        }
      },
      caption: args => {
        if (args['owned']) {
          return args['name']
            ? `Edit '${args['name']}' Dashboard`
            : 'Edit the ContainDS Dashboard';
        } else {
          return args['name']
            ? `Open ${args['username']}'s '${
                args['name']
              }' Dashboard in a New Browser Tab`
            : 'Open a ContainDS Dashboard in a New Browser Tab';
        }
      },
      execute: args => {
        const url = args['url'] as string;
        const owned = args['owned'] as boolean;
        if (url) {
          if (owned && args['path']) {
            commands.execute('docmanager:open', {
              path: args['path']
            });
          } else {
            window.open(url, '_blank');
          }
        }
      },
      icon: CONTAINDS_ICON_CLASS
    });

    if (palette) {
      const category = 'Notebook Operations'; // Same category as Voilà
      palette.addItem({ command: CommandIDs.containdsCreate, category });
    }

    if (menu && menu.viewMenu) {
      menu.viewMenu.addGroup(
        [
          {
            command: CommandIDs.containdsCreate
          }
        ],
        1001
      );
    }

    if (launcher) {
      Private.addDashboardsToLauncher(
        launcher,
        hubHost + URLExt.join(hubPrefix, 'dashboards-api')
      ).catch(reason => {
        console.error('Fail to add dashboards to the launcher', reason);
      });
    }

    const dashboardButton = new ContainDSOpenButton(commands);
    docRegistry.addWidgetExtension('Notebook', dashboardButton);
  }
};

export default extension;

/* eslint-disable no-inner-declarations */
namespace Private {
  /**
   * Add dashboards to the launcher
   *
   * @param launcher JupyterFrontEnd launcher
   * @param endpoint API URL to get dashboards
   */
  export async function addDashboardsToLauncher(
    launcher: ILauncher,
    endpoint: string
  ): Promise<void> {
    const dashboardsMap = await requestAPI<ContainDS.IDashboards>(endpoint);
    for (const user in dashboardsMap) {
      if (Object.prototype.hasOwnProperty.call(dashboardsMap, user)) {
        const dashboards = dashboardsMap[user];
        const owned = user === '_owned';
        dashboards.map(dashboard => {
          launcher.add({
            command: CommandIDs.containdsOpen,
            args: { ...dashboard, owned },
            category: owned
              ? 'Your ContainDS Dashboards'
              : 'Shared ContainDS Dashboards'
          });
        });
      }
    }
  }
}
