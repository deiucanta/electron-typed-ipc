# Electron Typed IPC

- no runtime cost (just typescript enhancements)
- keeps the same API as Electron
- separates events from commands to avoid confusions
  - events are things that happened (IPC)
  - commands are async functions you can invoke (RPC)

## Usage

### 1. Install from npm

```
npm i electron-typed-ipc --save
```

### 2. Define your events/commands

```ts
type Events = {
  configUpdated: (newConfig?: Config, oldConfig?: Config) => void;
};

type Commands = {
  fetchConfig: () => Config;
  updateConfig: (newConfig: Partial<Config>) => void;
};
```

### 3. Add types to `ipcMain` and `ipcRenderer`

```ts
import { TypedIpcMain, TypedIpcRenderer } from "electron-typed-ipc";

const typedIpcMain = ipcMain as TypedIpcMain<Events, Commands>;
const typesIpcRenderer = ipcRenderer as TypedIpcRenderer<Events, Commands>;
```

### 4. Emit events and invoke commands

```ts
// renderer.js
const config = await typedIpcRenderer.invoke('fetchConfig');

// main.js
typedIpcMain.handle('fetchConfig', () => {
  return { a: 1, b: 'text' };
});
```

```ts
// renderer.js
typedIpcRenderer.on('configUpdated', (_, newConfig, oldConfig) => {
  console.log(newConfig, oldConfig);
});

// main.ts
webContents
  .getAllWebContents()
  .forEach((renderer: TypedWebContents<Events>) => {
    renderer.send('configUpdated', newConfig, oldConfig);
  });
```
