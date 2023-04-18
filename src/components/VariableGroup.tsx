import {SnapshotFrame, Variable, VariableID} from "../types";
import React, {useState} from "react";
import {Dropdown, IconButton, Menu, useStyles2, VerticalGroup} from "@grafana/ui";
import {css, cx} from "@emotion/css";

export interface VariableProps {
    variableID: VariableID
    lookup: (varId: VariableID) => Variable
    depth: number
}

const getStyles = () => ({
    list: css`
      margin-left: 8px;
      list-style: none;
    `,
    varName: css`
      margin-right: 5px;
      color: rgb(178 211 255)
    `,
    varOrigName: css`
      margin-right: 5px;
    `,
    varValue: css``,
    varType: css``,
    varHash: css``,
    snapVar: css`
      font-family: monospace;
      padding: 5px;
      cursor: pointer;
    `,
    scroll: css`
      overflow-y: scroll;
    `,
    varValueLine: css`
      align-items: center;
      display: flex;
    `
})

export function VariableValue({variableID, lookup, depth}: VariableProps) {
    const styles = useStyles2(getStyles);
    const [open, setOpen] = useState(false)
    const onClick = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setOpen(!open)
    }
    const variable = lookup(variableID);

    let variableName = <span className={styles.varName}>{variableID.name}</span>;
    if (variableID.original_name) {
        variableName = <span><span className={styles.varName}>{variableID.name}</span><span
            className={styles.varOrigName}>({variableID.original_name})</span></span>
    }

    const menu = (
        <Menu>
            <Menu.Item label="Google"/>
        </Menu>
    );

    return (
        <div className={styles.snapVar}>
            <div onClick={onClick}>
                {variableName} <span className={styles.varHash}>({variable.hash})</span> <span
                className={styles.varType}>{variable.type}</span>
            </div>
            <div className={styles.varValueLine}>
                <Dropdown overlay={menu}>
                    <IconButton name="ellipsis-v"/>
                </Dropdown>
                <span onClick={onClick} className={styles.varValue}>{variable.value}</span>
            </div>
            <div>
                {open &&
                    (
                        <ul>
                            {variable.children?.map(value => {
                                return <li className={styles.list}><VariableValue variableID={value} lookup={lookup}
                                                                                  depth={depth + 1}/></li>
                            })}
                        </ul>
                    )
                }</div>
        </div>
    )
}

export interface Props {
    lookup: Variable[]
    frame?: SnapshotFrame
    height: number
}

export function VariableGroup({lookup, frame, height}: Props) {
    const styles = useStyles2(getStyles);

    const lookupFunc = (varId: VariableID) => {
        return lookup[parseInt(varId.ID)]
    }

    return (
        <div className={cx(styles.scroll, css`height: ${height}px`)}>
            <VerticalGroup>
                <ul>
                    {
                        frame?.variables?.map(value => {
                            return <li className={styles.list}><VariableValue variableID={value} lookup={lookupFunc}
                                                                              depth={0}/></li>
                        })
                    }
                </ul>
            </VerticalGroup>
        </div>
    )
}