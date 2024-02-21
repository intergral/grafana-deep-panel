/*
 *     Copyright (C) 2023  Intergral GmbH
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, {useEffect, useState} from 'react';
import {PanelProps} from '@grafana/data';
import {SnapshotFrame, SnapshotPanelOptions} from 'types';
import {css, cx} from '@emotion/css';
import {useStyles2} from '@grafana/ui';
import {FramesGroup} from './FramesGroup';
import {VariableGroup} from './VariableGroup';
import {SnapshotMetaGroup} from './SnapshotMetaGroup';
import {LogMsg} from "./LogMsg";

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
  const [selectedFrame, setCurrentFrame] = useState<SnapshotFrame>(data.series[0].fields[4].values[0]?.[0] ?? null);

  useEffect(() => {
    setCurrentFrame(data.series[0].fields[4].values[0]?.[0] ?? null);
  }, [data.series]);


  let metaDataHeight = height;
  let logData;
  if (data.series[0].fields[9].values[0]) {
    logData = <div className={cx(
        css`
          height: ${height * .1}px;
        `
    )}>
      <LogMsg options={options}
              logMsg={data.series[0].fields[9].values[0]}
      />
    </div>
    metaDataHeight = height * .85;
  }

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
      <div className={cx(
          css`
            display: flex;
            flex-direction: column;
          `
      )}>
        <div className={cx(
            css`
              width: ${width}px;
              height: ${metaDataHeight}px;
              display: flex;
              flex-direction: row;
              margin-bottom: ${height * .05}px;
            `
        )}>
          <div style={{minWidth: '500px'}}>
            <FramesGroup
                options={options}
                frames={data.series[0].fields[4].values[0]}
                onChange={(sf) => setCurrentFrame(sf)}
                height={metaDataHeight}
            />
          </div>
          <div style={{flex: 1}}>
            <VariableGroup
                options={options}
                lookup={data.series[0].fields[2].values[0]}
                frame={selectedFrame}
                height={metaDataHeight}
            />
          </div>

          <div style={{minWidth: '500px', maxWidth: '500px'}}>
            <SnapshotMetaGroup
                options={options}
                lookup={data.series[0].fields[2].values[0]}
                tracepoint={data.series[0].fields[1].values[0]}
                watchResults={data.series[0].fields[5].values[0]}
                attributes={data.series[0].fields[6].values[0]}
                resource={data.series[0].fields[8].values[0]}
                height={metaDataHeight}
            />
          </div>
        </div>
      </div>
      {logData}
    </div>
  );
};
