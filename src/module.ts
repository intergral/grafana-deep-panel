import { PanelPlugin } from '@grafana/data';
import { SnapshotPanelOptions } from './types';
import { SnapshotPanel } from './components/SnapshotPanel';

export const plugin = new PanelPlugin<SnapshotPanelOptions>(SnapshotPanel).setPanelOptions((builder) => {
  return builder;
});
