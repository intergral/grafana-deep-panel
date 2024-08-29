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

function shortClassName(className: string) {
  if (!className.includes(".")){
    return className
  }

  const parts = className.split('.');
  const last = parts.pop();
  return parts.map(p => p[0]).join(".") +'.' + last
}

function frameTooltip(frame: SnapshotFrame) {

  let location = ''
  if (frame.line_number) {
    location += `on line ${frame.line_number} `
  }

  if(frame.file_name) {
    if(location) {
      location += `of file ${frame.file_name},`
    } else {
      location += `in file ${frame.file_name},`
    }
  }


  return `Frame ${location} in ${
      frame.class_name ? frame.class_name : ''
  }#${frame.method_name}`;
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
    className = <span className={styles.frameClass}> {shortClassName(frame.class_name)}</span>;
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
    <>
      <div
        title={frameTooltip(frame)}
      >
        <div
          onClick={() => {
            onClick(frame);
          }}
        >
          {check}
          {async} <span className={styles.frameMethod}>{frame.method_name}</span>,{' '}
          {
            frame.file_name ? <span className={styles.frameFile}>{frame.file_name}</span> : <span className={styles.noSource}>{"<unknown sourcefile>"}</span>
          }
          {
            frame.line_number ? <>:<span className={styles.frameLine}>{frame.line_number}</span></> : ''
          }
          {frame.column_number && <span className={styles.frameLine}>:{frame.column_number}</span>}
          {className}
        </div>
      </div>
      {transpiled}
    </>
  );
}

const getStyles = () => ({
  fullHeight: css`
    height: 100%;
  `,
  scroll: css`
    overflow-y: scroll;
    overflow-x: hidden;
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
    max-width: 450px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
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
    opacity: 0.5;   
  `,
  noSource: css`
    color: #afafaf
  `
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
    <div style={{minWidth: '500px', maxWidth: '500px'}}
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
