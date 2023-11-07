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

import React from "react";
import {SnapshotPanelOptions} from "../types";
import {Dropdown, IconButton, Menu, useStyles2} from "@grafana/ui";
import {css} from "@emotion/css";

interface Props {
    options: SnapshotPanelOptions;
    logMsg: string;
}

const getStyles = () => ({
    logActions: css`
      width: 20px;
      margin-right: 5px;
      align-items: center;
      display: flex;
    `,
    logLine: css`
      margin-top: 5px;
      align-items: center;
      display: flex;
      padding: 5px;
    `,
});


export const LogMsg: React.FC<Props> = ({ logMsg}) => {
    const styles = useStyles2(getStyles);
    const menu =  (
        <Menu>
            <Menu.Item
                label="Copy"
                icon="copy"
                childItems={[<Menu.Item key={'item1'} label="Value" onClick={() => navigator.clipboard.writeText(logMsg)} />]}
            />
        </Menu>
    );
    return (
        <pre className={styles.logLine}>
            <span className={styles.logActions}>
              <Dropdown overlay={menu}>
                <IconButton name="ellipsis-v" aria-label="Actions" tooltip="Variable Actions"/>
              </Dropdown>
            </span>
            {logMsg}
        </pre>
    )
}