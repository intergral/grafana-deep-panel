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
import {Dropdown, Icon, IconButton, Menu, Tooltip, useStyles2} from '@grafana/ui';
import { css, cx } from '@emotion/css';
import { SnapshotPanelOptions, Variable, VariableID } from '../types';

const getStyles = () => ({
  variable: css`
    font-family: monospace;
    padding: 5px;
  `,
  variableHash: css`
    font-style: italic;
  `,
  varValue: css`
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  `,
  childIndicator: css`
    margin-right: 5px;
  `,
  varValueLine: css`
    margin-top: 5px;
    align-items: center;
    display: flex;
  `,
  varType: css`
    font-style: italic;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  `,
  varActions: css`
    width: 20px;
    margin-right: 5px;
    align-items: center;
    display: flex;
  `,
  varModifiers: css`
    margin-right: 5px;
  `,
  varName: css`
    margin-right: 5px;
    color: rgb(178 211 255);
  `,
  varOrigName: css`
    margin-right: 5px;
  `,
  varHash: css`
    font-weight: lighter;
    color: #808080;
    margin-right: 5px;
  `,
  list: css`
    margin-left: 8px;
    list-style: none;
  `,
  notFound: css`
    color: pink;
  `,
});

interface VariableDisplayProps {
  name: string | JSX.Element;
  type: string;
  value: string;
  id?: string;
  hash?: string | JSX.Element;
  children?: JSX.Element | boolean;
  hasChildren?: boolean;
  open?: boolean;
  onClick?: (id?: string) => void;
  menu?: JSX.Element;
  width: number;
}

export function VariableDisplay({
  id,
  name,
  type,
  hash,
  value,
  children,
  onClick,
  hasChildren = false,
  menu,
  width,
  open,
}: VariableDisplayProps) {
  const styles = useStyles2(getStyles);

  function clickVariable(e: any) {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(id);
  }

  if (typeof name === 'string') {
    name = <span className={styles.varName}>{name}</span>;
  }

  if (typeof hash === 'string') {
    hash = <span className={styles.varHash}>({hash})</span>;
  }

  menu = menu ?? (
    <Menu>
      <Menu.Item
        label="Copy"
        icon="copy"
        childItems={[<Menu.Item key={'item1'} label="Value" onClick={() => navigator.clipboard.writeText(value)} />]}
      />
    </Menu>
  );

  return (
    <div className={cx(styles.variable,
      css`
            width: ${width}px;
          `)}>
      <div onClick={clickVariable} style={{ cursor: hasChildren ? 'pointer' : 'inherit' }} className={
        cx(styles.varType,
            css`
            width: ${width}px;
          `)}>
        {name}
        {hash}
        {type}
      </div>
      <div className={styles.varValueLine}>
        <span className={styles.varActions}>
          <Dropdown overlay={menu}>
            <IconButton name="ellipsis-v" aria-label="Variable Actions" tooltip="Variable Actions"/>
          </Dropdown>
        </span>
        {hasChildren && (
            <Tooltip content={(children ? "Collapse" : "Expand") + " children."}>
          <Icon
            onClick={clickVariable}
            className={styles.childIndicator}
            size={'xl'}
            name={children ? 'angle-down' : 'angle-right'}
          /></Tooltip>
        )}
        <span
          style={{ cursor: hasChildren ? 'pointer' : 'inherit' }}
          onClick={clickVariable}
          className={cx(styles.varValue, css`
            white-space: ${open ? 'inherit': 'nowrap'};`)}
        >
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}

export interface VariableProps {
  options: SnapshotPanelOptions;
  variableID: VariableID;
  lookup: (varId: VariableID) => Variable | undefined;
  depth: number;
  width: number;
}

export function VariableValue({ options, variableID, lookup, depth, width }: VariableProps) {
  const styles = useStyles2(getStyles);
  const [open, setOpen] = useState(depth < options.autoExpandDepth);
  width -= 40

  useEffect(() => {
    setOpen(depth < options.autoExpandDepth);
  }, [options.autoExpandDepth, depth]);

  let modifiers;
  if (variableID.modifiers?.length) {
    modifiers = (
      <span className={styles.varModifiers} title={variableID.modifiers.join(' ')}>
        {variableID.modifiers.map((modifier, index) => {
          return <span key={index}>{modifier[0]}</span>;
        })}
      </span>
    );
  }

  let variableName = (
    <span>
      {modifiers}
      <span className={styles.varName}>{variableID.name}</span>
    </span>
  );
  if (variableID.original_name) {
    variableName = (
      <span>
        {modifiers}
        <span className={styles.varName}>{variableID.name}</span>
        <span title={'We have renamed this variable, to better suit the source code.'} className={styles.varOrigName}>
          ({variableID.original_name})
        </span>
      </span>
    );
  }

  const variable = lookup(variableID);

  if (!variable) {
    // this case seems unlikely in normal execution, it is mainly here for test cases.
    return (
      <VariableDisplay
        name={variableName}
        hash={
          <span title={'Could not find variable in response.'} className={styles.notFound}>
            not found
          </span>
        }
        type={"<not found>"}
        value={`Cannot find variable: #${variableID.ID}`}
        width={width}
      />
    );
  }

  const menu = (
    <Menu>
      <Menu.Item
        label="Copy"
        icon="copy"
        childItems={[
          <Menu.Item key={'item1'} label="Value" onClick={() => navigator.clipboard.writeText(variable.value)} />,
          <Menu.Item key={'item2'} label="Name" onClick={() => navigator.clipboard.writeText(variableID.name)} />,
          <Menu.Item key={'item3'} label="Hash" onClick={() => navigator.clipboard.writeText(variable.hash)} />,
        ]}
      />
    </Menu>
  );

  return (
    <VariableDisplay
      name={variableName}
      type={variable.type}
      value={variable.value}
      onClick={() => setOpen(!open)}
      open={open}
      hasChildren={!!variable.children?.length}
      menu={menu}
      hash={variable.hash}
      width={width}
    >
      {open && (
        <ul style={{ marginLeft: '20px' }}>
          {variable.children?.map((value, index) => {
            return (
              <li key={index} className={styles.list}>
                <VariableValue options={options} variableID={value} lookup={lookup} depth={depth + 1} width={width} />
              </li>
            );
          })}
        </ul>
      )}
    </VariableDisplay>
  );
}
