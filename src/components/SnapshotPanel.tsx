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

import React, { useEffect, useState } from 'react';
import { GrafanaTheme2, PanelProps } from '@grafana/data';
import { SnapshotFrame, SnapshotPanelOptions } from 'types';
import { css, cx } from '@emotion/css';
import { Collapse, HorizontalGroup, Icon, TagList, Tooltip, useStyles2, VerticalGroup } from '@grafana/ui';
import { FramesGroup } from './FramesGroup';
import { VariableGroup } from './VariableGroup';
import { SnapshotMetaGroup } from './SnapshotMetaGroup';
import { LogMsg } from './LogMsg';

interface Props extends PanelProps<SnapshotPanelOptions> {}

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    font-family: monospace;
    position: relative;
  `,
  fullHeight: css`
    height: 100%;
  `,
  collapseLabel: css`
    svg {
      color: #aaa;
      margin: -2px 0 0 10px;
    }
  `,
  nextPrevResult: css`
    flex: 1;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-right: ${theme.spacing(1)};
    overflow: hidden;
  `,
});

const DEFAULT_HEIGHT = 400;
const DEFAULT_EXPANDED_HEIGHT = 800;
const METADATA_CLOSED_HEIGHT = 50;
const METADATA_OPEN_HEIGHT = 70;

export const SnapshotPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const [selectedFrame, setCurrentFrame] = useState<SnapshotFrame>(data.series[0].fields[4].values[0]?.[0] ?? null);
  const [metadataopen, setMetadataopen] = useState(false);
  const [containerHeight, setcontainerHeight] = useState(height || DEFAULT_HEIGHT);
  // height is set so we need to fit in that size
  const heightSet = height !== 0;

  useEffect(() => {
    setCurrentFrame(data.series[0].fields[4].values[0]?.[0] ?? null);
  }, [data.series]);

  useEffect(() => {
    setcontainerHeight(height || DEFAULT_HEIGHT);
  }, [height]);

  let logOffset = 0;
  let logData;
  if (data.series[0].fields[9].values[0]) {
    logData = (
      <div
        className={cx(
          css`
            height: 30px;
            width: ${width}px;
          `
        )}
      >
        <LogMsg options={options} logMsg={data.series[0].fields[9].values[0]} />
      </div>
    );
    logOffset = 40;
  }

  const resourceTags = Object.entries(data.series[0].fields[8].values[0]).map(([k, v]) => `${k}:${v}`);
  const attributeTags = Object.entries(data.series[0].fields[6].values[0]).map(([k, v]) => `${k}:${v}`);
  const tags = [...resourceTags, ...attributeTags];

  const collapseLabel = (
    <>
      <Tooltip content="" placement="right">
        <span className={styles.collapseLabel}>
          Snapshot Attributes
          <Icon size="md" name="info-circle" />
        </span>
      </Tooltip>
      <div className={styles.nextPrevResult}>
        <TagList tags={tags} displayMax={3} />
      </div>
    </>
  );

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${containerHeight}px;
        `
      )}
    >
      <VerticalGroup justify={'flex-start'} spacing={'xs'} align={'flex-start'} width={'100%'}>
        <Collapse
          className={cx(css`
            width: ${width}px;
          `)}
          collapsible={true}
          label={collapseLabel}
          onToggle={() => {
            const newState = !metadataopen;
            setMetadataopen(newState);
            if (!heightSet) {
              setcontainerHeight(!newState ? DEFAULT_HEIGHT : DEFAULT_EXPANDED_HEIGHT);
            }
          }}
          isOpen={metadataopen}
        >
          <SnapshotMetaGroup
            options={options}
            lookup={data.series[0].fields[2].values[0]}
            tracepoint={data.series[0].fields[1].values[0]}
            watchResults={data.series[0].fields[5].values[0]}
            attributes={data.series[0].fields[6].values[0]}
            resource={data.series[0].fields[8].values[0]}
            height={(containerHeight - METADATA_OPEN_HEIGHT) / 2}
            width={width}
          />
        </Collapse>
        <HorizontalGroup>
          <FramesGroup
            options={options}
            frames={data.series[0].fields[4].values[0]}
            onChange={(sf) => setCurrentFrame(sf)}
            height={
              (metadataopen ? (containerHeight - METADATA_OPEN_HEIGHT) / 2 : containerHeight - METADATA_CLOSED_HEIGHT) -
              logOffset
            }
          />
          <VariableGroup
            options={options}
            lookup={data.series[0].fields[2].values[0]}
            frame={selectedFrame}
            height={
              (metadataopen ? (containerHeight - METADATA_OPEN_HEIGHT) / 2 : containerHeight - METADATA_CLOSED_HEIGHT) -
              logOffset
            }
            width={width - 510}
          />
        </HorizontalGroup>
        {logData}
      </VerticalGroup>
    </div>
  );
};
