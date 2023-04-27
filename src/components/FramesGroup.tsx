import React, { useEffect, useState } from 'react';
import { Icon, useStyles2, VerticalGroup } from '@grafana/ui';
import { SnapshotFrame, SnapshotPanelOptions } from '../types';
import { css, cx } from '@emotion/css';

export interface FrameProps {
  options: SnapshotPanelOptions;
  frame: SnapshotFrame;
  onClick: (sf: SnapshotFrame) => void;
}

export interface Props {
  options: SnapshotPanelOptions;
  frames: SnapshotFrame[];
  onChange: (sf: SnapshotFrame) => void;
  height: number;
}

export function FrameItem({ options, frame, onClick }: FrameProps) {
  const styles = useStyles2(getStyles);
  let check;
  if (frame.app_frame) {
    check = <Icon name="check" title={'Is App frame'} />;
  }
  let async;
  if (frame.is_async) {
    async = <Icon name="exchange-alt" title={'Is Async frame'} />;
  }

  let className;
  if (frame.class_name) {
    className = <span className={styles.frameClass}> {frame.class_name}</span>;
  }

  let transpiled;
  if (options.showTranspiled && frame.transpiled_file_name) {
    transpiled = (
      <div title={`Frame transpiled from runtime location`}>
        <Icon name="eye" title={'Compiled location'} />
        <span className={styles.transpiledFile}>{frame.transpiled_file_name}</span>:
        <span className={styles.frameLine}>{frame.transpiled_line_number}</span>
        {frame.transpiled_column_number && <span className={styles.frameLine}>:{frame.transpiled_column_number}</span>}
      </div>
    );
  }
  return (
    <div>
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
          {check}
          {async} <span className={styles.frameMethod}>{frame.method_name}</span>,{' '}
          <span className={styles.frameFile}>{frame.file_name}</span>:
          <span className={styles.frameLine}>{frame.line_number}</span>
          {frame.column_number && <span className={styles.frameLine}>:{frame.column_number}</span>}
          {className}
        </span>
      </div>
      {transpiled}
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
  transpiledFile: css`
    margin-left: 5px;
    color: #008800;
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

export function FramesGroup({ options, frames, onChange, height }: Props) {
  const styles = useStyles2(getStyles);
  const [selectedFrameIndex, setFrameIndex] = useState<number>(0);

  const fromOptions = (frame: SnapshotFrame) => {
    if (options.onlyAppFrames) {
      return frame.app_frame;
    }
    return true;
  };

  useEffect(() => {
    setFrameIndex(0);
  }, [frames]);

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
          {frames.filter(fromOptions).map((frame: SnapshotFrame, index: number) => {
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
                  options={options}
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
