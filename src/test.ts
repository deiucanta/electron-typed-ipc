import { ipcMain, ipcRenderer, webContents } from 'electron';
import { TypedIpcMain, TypedIpcRenderer, TypedWebContents } from './index';

type Config = {
  a: number;
  b: string;
};

type Events = {
  configUpdated: (newConfig?: Config, oldConfig?: Config) => void;
};

type Commands = {
  fetchConfig: () => Config;
  updateConfig: (newConfig: Partial<Config>) => void;
};

export const typedIpcMain = ipcMain as TypedIpcMain<Events, Commands>;
export const typedIpcRenderer = ipcRenderer as TypedIpcRenderer<
  Events,
  Commands
>;

typedIpcMain.handle('fetchConfig', () => {
  return { a: 1, b: 'text1' };
});

export function fetchConfig() {
  const config: Promise<Config> = typedIpcRenderer.invoke('fetchConfig');
  return config;
}

typedIpcRenderer.on('configUpdated', (_, newConfig, oldConfig) => {
  console.log(newConfig, oldConfig);
});

webContents
  .getAllWebContents()
  .forEach((renderer: TypedWebContents<Events>) => {
    const newConfig = {
      a: 2,
      b: 'text2',
    };
    const oldConfig = {
      a: 1,
      b: 'text1',
    };
    renderer.send('configUpdated', newConfig, oldConfig);
  });
