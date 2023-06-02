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

import { SnapshotFrame, SnapshotPanelOptions, Variable, VariableID } from '../types';
import React from 'react';
import { useStyles2, VerticalGroup } from '@grafana/ui';
import { css, cx } from '@emotion/css';
import { VariableValue } from './VariableComponent';

const getStyles = () => ({
  list: css`
    margin-left: 8px;
    list-style: none;
  `,
  scroll: css`
    overflow-y: scroll;
  `,
  snapVars: css`
    border-right: 4px solid #22252b;
  `,
});

export interface Props {
  options: SnapshotPanelOptions;
  lookup: Variable[];
  frame?: SnapshotFrame;
  height: number;
}

export function VariableGroup({ options, lookup, frame, height }: Props) {
  const styles = useStyles2(getStyles);

  const lookupFunc = (varId: VariableID) => {
    return lookup?.[parseInt(varId.ID, 10)];
  };

  return (
    <div
      className={cx(
        styles.scroll,
        css`
          height: ${height}px;
        `,
        styles.snapVars
      )}
    >
      {!frame?.variables && (
        <VerticalGroup justify="center" align="center">
          <span>No Variable data</span>
        </VerticalGroup>
      )}
      {frame?.variables && (
        <VerticalGroup>
          <ul>
            {frame?.variables?.map((value, index) => {
              return (
                <li key={index} className={styles.list}>
                  <VariableValue options={options} variableID={value} lookup={lookupFunc} depth={0} />
                </li>
              );
            })}
          </ul>
        </VerticalGroup>
      )}
    </div>
  );
}
