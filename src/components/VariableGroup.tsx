import { SnapshotFrame, Variable, VariableID } from '../types';
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
  lookup: Variable[];
  frame?: SnapshotFrame;
  height: number;
}

export function VariableGroup({ lookup, frame, height }: Props) {
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
                  <VariableValue variableID={value} lookup={lookupFunc} depth={0} />
                </li>
              );
            })}
          </ul>
        </VerticalGroup>
      )}
    </div>
  );
}
