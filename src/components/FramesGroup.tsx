import React, { useState } from 'react';
import { Icon, useStyles2, VerticalGroup } from '@grafana/ui';
import { SnapshotFrame } from '../types';
import { css, cx } from '@emotion/css';

export interface FrameProps {
  frame: SnapshotFrame;
  onClick: (sf: SnapshotFrame) => void;
}

export interface Props {
  frames: SnapshotFrame[];
  onChange: (sf: SnapshotFrame) => void;
  height: number;
}

export function FrameItem({ frame, onClick }: FrameProps) {
  const styles = useStyles2(getStyles);
  let check;
  if (frame.app_frame) {
    check = <Icon name="check" title={'Is App frame'} />;
  }

  let className;
  if (frame.class_name) {
    className = <span className={styles.frameClass}> {frame.class_name}</span>;
  }
  return (
    <div
      title={`Frame on line ${frame.line_number} of file ${frame.file_name}, in ${
        frame.class_name ? frame.class_name : ''
      }#${frame.method_name}`}
    >
      <span
        onClick={() => {
          onClick(frame);
        }}
      >
        {check} <span className={styles.frameMethod}>{frame.method_name}</span>,{' '}
        <span className={styles.frameFile}>{frame.file_name}</span>:
        <span className={styles.frameLine}>{frame.line_number}</span>
        {className}
      </span>
    </div>
  );
}

const getStyles = () => ({
  fullHeight: css`
    height: 100%;
  `,
  scroll: css`
    overflow-y: scroll;
  `,
  frameMethod: css`
    color: #ff0000;
  `,
  frameFile: css`
    color: #008800;
  `,
  frameLine: css`
    color: rgb(255 187 255);
  `,
  frameClass: css`
    color: rgb(178 211 255);
  `,
  selectedFrame: css`
    background-color: #353c45;
  `,
  frameItem: css`
    padding: 5px;
    cursor: pointer;
  `,
  frameList: css`
    border-right: 4px solid #22252b;
  `,
  noVars: css`
    cursor: not-allowed !important;
  `,
});

export function FramesGroup({ frames, onChange, height }: Props) {
  const styles = useStyles2(getStyles);
  const [selectedFrameIndex, setFrameIndex] = useState<number>(0);

  return (
    <div
      className={cx(
        styles.scroll,
        css`
          height: ${height}px;
        `,
        styles.frameList
      )}
    >
      {!frames && (
        <VerticalGroup justify="center" align="center">
          <span>No Frame data</span>
        </VerticalGroup>
      )}
      {frames && (
        <ul>
          {frames.map((frame: SnapshotFrame, index: number) => {
            return (
              <li
                key={index}
                className={cx(
                  styles.frameItem,
                  selectedFrameIndex === index ? styles.selectedFrame : '',
                  !frame.variables?.length ? styles.noVars : ''
                )}
              >
                <FrameItem
                  onClick={() => {
                    if (!frame.variables?.length) {
                      return;
                    }
                    onChange(frame);
                    setFrameIndex(index);
                  }}
                  frame={frame}
                ></FrameItem>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
