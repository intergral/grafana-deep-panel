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

export interface SnapshotPanelOptions {
  onlyAppFrames: boolean;
  showTranspiled: boolean;
  autoExpandDepth: number;
}

export interface SnapshotFrame {
  file_name: string;
  method_name: string;
  line_number: number;
  class_name?: string;
  is_async?: boolean;
  column_number?: number;
  transpiled_file_name?: string;
  transpiled_line_number?: number;
  transpiled_column_number?: number;
  variables?: VariableID[];
  app_frame?: boolean;

  selected?: boolean;
}

export interface Tracepoint {
  ID: string;
  path: string;
  line_number: number;
  args: TracepointArgs;
  watches: string[];
}

export interface TracepointArgs {
  [key: string]: string;

  fire_count: string;
  fire_period: string;
}

export interface VariableID {
  ID: string;
  name: string;
  modifiers?: string[];
  original_name?: string;
}

export interface Variable {
  type: string;
  value: string;
  hash: string;
  children: VariableID[];
  truncated?: boolean;
}

export interface WatchResult {
  expression: string;
  Result: {
    GoodResult?: VariableID;
    ErrorResult?: string;
  };
}

export interface Attributes {
  [key: string]: any;
}

export interface ResourceAttributes extends Attributes {
  'service.name': string;
}

export interface SnapshotAttributes extends Attributes {
  path: string;
  line: string;
  frame: string;
}
