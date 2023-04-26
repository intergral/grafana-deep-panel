
export interface SnapshotPanelOptions {
}


export interface SnapshotFrame {
    file_name: string
    method_name: string
    line_number: number
    class_name?: string
    is_async?: boolean
    column_number?: number
    transpiled_file_name?: string
    transpiled_line_number?: number
    transpiled_column_number?: number
    variables?: VariableID[]
    app_frame?: boolean

    selected?: boolean
}

export interface Tracepoint {
    ID: string
    path: string
    line_number: number
    args: TracepointArgs
    watches: string[]
}

export interface TracepointArgs {
    [key: string]: string

    fire_count: string
    fire_period: string
}

export interface VariableID {
    ID: string
    name: string
    modifiers?: string[]
    original_name?: string
}

export interface Variable {
    type: string
    value: string
    hash: string
    children: VariableID[]
    truncated?: boolean
}

export interface WatchResult {
    expression: string
    Result: {
        GoodResult?: VariableID
        ErrorResult?: string
    }
}

export interface Attributes {
    [key: string]: string
}

export interface ResourceAttributes extends Attributes {
    "service.name": string
}

export interface SnapshotAttributes extends Attributes {
    path: string
    line: string
    frame: string
}