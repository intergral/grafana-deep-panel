import React, { useState } from 'react';
import { Dropdown, Icon, IconButton, Menu, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { Variable, VariableID } from '../types';

const getStyles = () => ({
  variable: css`
    font-family: monospace;
    padding: 5px;
  `,
  variableHash: css`
    font-style: italic;
  `,
  varValue: css``,
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
  `,
  varActions: css`
    width: 20px;
    margin-right: 5px;
    align-items: center;
    display: flex;
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
  type: string | JSX.Element;
  value: string;
  id?: string;
  hash?: string | JSX.Element;
  children?: JSX.Element | boolean;
  hasChildren?: boolean;
  onClick?: (id?: string) => void;
  menu?: JSX.Element;
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

  if (typeof type === 'string') {
    type = <span className={styles.varType}>{type}</span>;
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
    <div className={styles.variable}>
      <div onClick={clickVariable} style={{ cursor: hasChildren ? 'pointer' : 'inherit' }}>
        {name}
        {hash}
        {type}
      </div>
      <div className={styles.varValueLine}>
        <span className={styles.varActions}>
          <Dropdown overlay={menu}>
            <IconButton name="ellipsis-v" />
          </Dropdown>
        </span>
        {hasChildren && (
          <Icon className={styles.childIndicator} size={'xl'} name={children ? 'angle-down' : 'angle-right'} />
        )}
        <span
          style={{ cursor: hasChildren ? 'pointer' : 'inherit' }}
          onClick={clickVariable}
          className={styles.varValue}
        >
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}

export interface VariableProps {
  variableID: VariableID;
  lookup: (varId: VariableID) => Variable;
  depth: number;
}

export function VariableValue({ variableID, lookup, depth }: VariableProps) {
  const styles = useStyles2(getStyles);
  const [open, setOpen] = useState(false);

  let variableName = <span className={styles.varName}>{variableID.name}</span>;
  if (variableID.original_name) {
    variableName = (
      <span>
        <span className={styles.varName}>{variableID.name}</span>
        <span className={styles.varOrigName}>({variableID.original_name})</span>
      </span>
    );
  }

  const variable = lookup(variableID);
  if (!variable) {
    // this case seems unlikely in normal execution, it is mainly here for test cases.
    return (
      <VariableDisplay
        name={variableName}
        type={
          <span title={'Could not find variable in response.'} className={styles.notFound}>
            not found
          </span>
        }
        value={`Cannot find variable: #${variableID.ID}`}
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
      hasChildren={!!variable.children?.length}
      menu={menu}
      hash={variable.hash}
    >
      {open && (
        <ul style={{ marginLeft: '20px' }}>
          {variable.children?.map((value, index) => {
            return (
              <li key={index} className={styles.list}>
                <VariableValue variableID={value} lookup={lookup} depth={depth + 1} />
              </li>
            );
          })}
        </ul>
      )}
    </VariableDisplay>
  );
}
