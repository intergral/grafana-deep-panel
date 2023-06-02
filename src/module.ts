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

import { PanelPlugin } from '@grafana/data';
import { SnapshotPanelOptions } from './types';
import { SnapshotPanel } from './components/SnapshotPanel';

export const plugin = new PanelPlugin<SnapshotPanelOptions>(SnapshotPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      defaultValue: false,
      name: 'Show Only App Frames',
      path: 'onlyAppFrames',
      description:
        'Include only the frames that are from your app. Do not display frames that come from frameworks, or low level parts of the language. e.g. java.lang.Thread',
    })
    .addBooleanSwitch({
      defaultValue: false,
      name: 'Show transpiled location',
      path: 'showTranspiled',
      description:
        'Show the location where transpiled code is executed, instead of the mapped location. e.g. show the executed java script location as well as the typescript source code location',
    })
    .addNumberInput({
      defaultValue: 1,
      name: 'Auto expand depth',
      path: 'autoExpandDepth',
      description: 'Automatically expand the variables to the set depth.',
    });
});
