import React, { useEffect, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SnapshotFrame, SnapshotPanelOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { FramesGroup } from './FramesGroup';
import { VariableGroup } from './VariableGroup';
import { SnapshotMetaGroup } from './SnapshotMetaGroup';

interface Props extends PanelProps<SnapshotPanelOptions> {}

const getStyles = () => ({
  wrapper: css`
    font-family: monospace;
    position: relative;
  `,
  fullHeight: css`
    height: 100%;
  `,
});

export const SnapshotPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const [selectedFrame, setCurrentFrame] = useState<SnapshotFrame>(data.series[0].fields[4].values.get(0)?.[0] ?? null);

  useEffect(() => {
    setCurrentFrame(data.series[0].fields[4].values.get(0)?.[0] ?? null);
  }, [data.series]);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ minWidth: '500px' }}>
          <FramesGroup
            frames={data.series[0].fields[4].values.get(0)}
            onChange={(sf) => setCurrentFrame(sf)}
            height={height}
          />
        </div>
        <div style={{ flex: 1 }}>
          <VariableGroup lookup={data.series[0].fields[2].values.get(0)} frame={selectedFrame} height={height} />
        </div>

        <div style={{ minWidth: '500px', maxWidth: '500px' }}>
          <SnapshotMetaGroup
            lookup={data.series[0].fields[2].values.get(0)}
            tracepoint={data.series[0].fields[1].values.get(0)}
            watchResults={data.series[0].fields[5].values.get(0)}
            attributes={data.series[0].fields[6].values.get(0)}
            resource={data.series[0].fields[8].values.get(0)}
            height={height}
          />
        </div>
      </div>
    </div>
  );
};
