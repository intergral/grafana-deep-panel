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

import {
  Attributes,
  ResourceAttributes,
  SnapshotAttributes,
  SnapshotPanelOptions,
  Tracepoint,
  Variable,
  VariableID,
  WatchResult,
} from '../types';
import { Alert, Tab, TabContent, TabsBar, useStyles2, VerticalGroup } from '@grafana/ui';
import React, { useState } from 'react';
import { css, cx } from '@emotion/css';
import { VariableDisplay, VariableValue } from './VariableComponent';

export interface Props {
  options: SnapshotPanelOptions;
  tracepoint: Tracepoint;
  watchResults?: WatchResult[];
  height: number;
  width: number;
  lookup: Variable[];
  resource: ResourceAttributes;
  attributes: SnapshotAttributes;
}

const tabs = [
  {
    label: 'Tracepoint',
    active: true,
  },
  {
    label: 'Watches',
    active: false,
  },
  {
    label: 'Resource',
    active: false,
  },
  {
    label: 'Attributes',
    active: false,
  },
];

const getStyles = () => ({
  snapMeta: css`
    margin-left: 5px;
  `,
  scroll: css`
    overflow-y: scroll;
  `,
  link: css`
    color: -webkit-link;
  `,
  txtLight: css`
    font-weight: lighter;
    color: #808080;
  `,
  itemKey: css`
    width: 50px;
    text-align: right;
    font-weight: bolder;
    color: #808080;
  `,
  itemValue: css`
    font-size: larger;
  `,
  itemView: css`
    border-bottom: 1px solid grey;
  `,
  itemKeyLine: css`
    margin-top: 5px;
  `,
  itemValueLine: css`
    padding-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    word-break: break-all;
  `,
  fullWidth: css`
    width: 100%;
  `,
  clearList: css`
    list-style: none;
  `,
  textCenter: css`
    text-align: center;
    font-size: 1rem;
  `,
  error: css`
    color: red;
  `,
});

export interface ItemViewProps {
  itemKey: string;
  itemValue: string;
  keyDecoration?: JSX.Element | boolean | string;
  valueDecoration?: JSX.Element | boolean | string;
  border?: boolean;
}

export function ItemView({ itemKey, itemValue, keyDecoration, valueDecoration, border = true }: ItemViewProps) {
  const styles = useStyles2(getStyles);

  return (
    <div className={border ? styles.itemView : ''}>
      <div className={styles.itemKeyLine}>
        <span className={styles.itemKey}>
          {itemKey}
          {keyDecoration}
        </span>
      </div>
      <div className={styles.itemValueLine}>
        <span className={styles.itemValue}>
          {itemValue}
          {valueDecoration}
        </span>
      </div>
    </div>
  );
}

export function TracepointView({ tracepoint }: { tracepoint: Tracepoint }) {
  const styles = useStyles2(getStyles);
  const fireCount = tracepoint.args?.fire_count ?? '1';

  const displayWatches = () => {
    const watches = tracepoint.watches ?? [];
    if (!watches.length) {
      return (
        <div className={styles.textCenter}>
          <span>No watches configured</span>
        </div>
      );
    }
    return (
      <VerticalGroup>
        <ul className={styles.clearList}>
          {watches.map((watch, index) => {
            return (
              <li key={index}>
                <span>{watch}</span>
              </li>
            );
          })}
        </ul>
      </VerticalGroup>
    );
  };

  const displayArgs = () => {
    const ignoredArgs = ['fire_count', 'fire_period'];

    function ignoredKey(value: string): boolean {
      return !ignoredArgs.includes(value);
    }

    const filteredArgs = Object.keys(tracepoint.args ?? {}).filter(ignoredKey);

    if (!filteredArgs.length) {
      return (
        <div className={styles.textCenter}>
          <span>No additional args</span>
        </div>
      );
    }
    return (
      <VerticalGroup>
        <ul className={styles.clearList}>
          {filteredArgs.map((key, index) => {
            const value = tracepoint.args[key];
            return (
              <li key={index}>
                <ItemView itemKey={key} itemValue={value} border={false} />
              </li>
            );
          })}
        </ul>
      </VerticalGroup>
    );
  };

  return (
    <div>
      <ItemView itemKey="File" itemValue={tracepoint.path} />
      <ItemView itemKey="Line" itemValue={(tracepoint.line_number ?? 0).toString(10)} />
      <ItemView
        itemKey="Fire Count"
        itemValue={fireCount}
        valueDecoration={fireCount === '-1' && <span className={styles.txtLight}> (infinite)</span>}
      />
      <ItemView
        itemKey="Fire Period"
        itemValue={tracepoint.args?.fire_period ?? '1000'}
        valueDecoration={<span className={styles.txtLight}> ms</span>}
      />
      <ItemView itemKey="Watches" itemValue="" valueDecoration={displayWatches()} />
      <ItemView
        itemKey="Args"
        keyDecoration={<span className={styles.txtLight}> (additional)</span>}
        itemValue=""
        valueDecoration={displayArgs()}
      />
    </div>
  );
}

export function WatchResultsView({
  options,
  results,
  lookup,
    width
}: {
  options: SnapshotPanelOptions;
  lookup: Variable[];
  results?: WatchResult[];
  width: number;
}) {
  const styles = useStyles2(getStyles);
  if (!results || !results?.length) {
    return (
      <VerticalGroup align="center" justify="flex-start">
        <Alert title="No watch results" severity="info">
          <div>
            To learn more about watches{' '}
            <a href="#" className={styles.link}>
              read the docs
            </a>
            .
          </div>
        </Alert>
      </VerticalGroup>
    );
  }

  const lookupFunc = (varId: VariableID) => {
    return lookup?.[parseInt(varId.ID, 10)] ?? null;
  };

  return (
    <div>
      <VerticalGroup>
        {results.map((val, index) => {
          return (
            <div key={index}>
              {val.Result.GoodResult && (
                <div>
                  <VariableValue options={options} variableID={val.Result.GoodResult} lookup={lookupFunc} depth={0} width={width}/>
                </div>
              )}
              {val.Result.ErrorResult && (
                <div>
                  <VariableDisplay
                    name={val.expression}
                    hash={
                      <span title={'Could not execute expression.'} className={styles.error}>
                        watch error
                      </span>
                    }
                    type={'<error>'}
                    value={val.Result.ErrorResult}
                    width={width}
                  />
                </div>
              )}
            </div>
          );
        })}
      </VerticalGroup>
    </div>
  );
}

export function AttributesView({ attrs, name, link }: { attrs: Attributes; name: string; link?: string }) {
  const styles = useStyles2(getStyles);
  const keys = Object.keys(attrs ?? {});
  if (!keys?.length) {
    return (
      <VerticalGroup align="center" justify="flex-start">
        <Alert title={`No ${name} values`} severity="info">
          {link && (
            <div>
              To learn more about {name}{' '}
              <a href="#" className={styles.link}>
                read the docs
              </a>
              .
            </div>
          )}
        </Alert>
      </VerticalGroup>
    );
  }
  return (
    <div>
      <VerticalGroup>
        <ul className={styles.fullWidth}>
          {keys.map((key, index) => {
            return (
              <li key={index}>
                <ItemView itemKey={key} itemValue={String(attrs[key])} />
              </li>
            );
          })}
        </ul>
      </VerticalGroup>
    </div>
  );
}

export function SnapshotMetaGroup({ options, tracepoint, lookup, watchResults, height, resource, attributes, width}: Props) {
  const styles = useStyles2(getStyles);
  if (watchResults && watchResults.length) {
    tabs[0].active = false;
    tabs[1].active = true;
  }
  const [state, updateState] = useState(tabs);
  return (
    <div
      className={cx(
        css`
          height: ${height}px;
        `,
        styles.snapMeta
      )}
    >
      <VerticalGroup>
        <TabsBar>
          {state.map((tab, index) => {
            return (
              <Tab
                key={index}
                label={tab.label}
                active={tab.active}
                onChangeTab={() =>
                  updateState(
                    state.map((tab, idx) => ({
                      ...tab,
                      active: idx === index,
                    }))
                  )
                }
              />
            );
          })}
        </TabsBar>
        <TabContent
          className={cx(
            styles.scroll,
            css`
              width: 100%;
              height: ${height - 47}px;
            `
          )}
        >
          {state[0].active && <TracepointView tracepoint={tracepoint} />}
          {state[1].active && <WatchResultsView options={options} lookup={lookup} results={watchResults} width={width} />}
          {state[2].active && <AttributesView name="Resource" attrs={resource} />}
          {state[3].active && <AttributesView name="Attribute" attrs={attributes} />}
        </TabContent>
      </VerticalGroup>
    </div>
  );
}
