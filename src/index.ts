import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from "@jupyterlab/application";

import {
  ICommandPalette,
  ToolbarButton
} from "@jupyterlab/apputils";

import { ISettingRegistry } from "@jupyterlab/settingregistry";

import { PageConfig } from "@jupyterlab/coreutils";

import { DocumentRegistry } from "@jupyterlab/docregistry";

import { IMainMenu } from "@jupyterlab/mainmenu";

import {
  INotebookTracker,
  NotebookPanel,
  INotebookModel
} from "@jupyterlab/notebook";

import { CommandRegistry } from "@lumino/commands";

import { ReadonlyJSONObject } from "@lumino/coreutils";

import { IDisposable } from "@lumino/disposable";

import { Token } from "@lumino/coreutils";

const IContainDSToken = new Token<IContainDSToken>('jupyterlab-containds:IContainDSToken');

interface IContainDSToken {}

class ContainDSToken implements IContainDSToken {}


const CONTAINDS_ICON_CLASS = 'jp-MaterialIcon cds-dashboard-icon'

/**
 * The command IDs used by the plugin.
 */
export namespace CommandIDs {
  export const containdsOpen = "notebook:open-with-containds";
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
      className: "containdsOpen",
      tooltip: "Deploy as a ContainDS Dashboard",
      iconClass: CONTAINDS_ICON_CLASS,
      iconLabel: "Dashboard",
      onClick: () => {
        this._commands.execute(CommandIDs.containdsOpen);
      }
    });
    panel.toolbar.insertAfter("cellType", "containdsOpen", button);
    console.log("INSERTED containdsOpen");
    return button;
  }

  private _commands: CommandRegistry;
}

/**
 * Initialization data for the jupyterlab-voila extension.
 */
const extension: JupyterFrontEndPlugin<IContainDSToken> = {
  id: "@ideonate/jupyter-containds:plugin",
  autoStart: true,
  requires: [INotebookTracker],
  optional: [ICommandPalette, ILayoutRestorer, IMainMenu, ISettingRegistry],
  provides: null,
  activate: (
    app: JupyterFrontEnd,
    notebooks: INotebookTracker,
    palette: ICommandPalette | null,
    restorer: ILayoutRestorer | null,
    provides: IContainDSToken,
    menu: IMainMenu | null,
    settingRegistry: ISettingRegistry | null
  ) => {

    const token = new ContainDSToken();

    function getCurrent(args: ReadonlyJSONObject): NotebookPanel | null {
      const widget = notebooks.currentWidget;
      const activate = args["activate"] !== false;

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
      const baseUrl = PageConfig.getBaseUrl();
      return `${baseUrl}../../hub/dashboards-endpoint/${path}`;
    }


    const { commands, docRegistry } = app;

    commands.addCommand(CommandIDs.containdsOpen, {
      label: "Create as a ContainDS Dashboard in New Browser Tab",
      execute: async args => {
        const current = getCurrent(args);
        if (!current) {
          return;
        }
        await current.context.save();
        const dashboardUrl = getDashboardUrl(current.context.path);
        window.open(dashboardUrl);
      },
      isEnabled
    });

    if (palette) {
      const category = "Notebook Operations";
      
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
    docRegistry.addWidgetExtension("Notebook", dashboardButton);

    console.log("DONE docRegistry.addWidgetExtension containdsOpen");

    return token;
  }
};

export default extension;
