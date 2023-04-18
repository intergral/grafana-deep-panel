import {Tracepoint, WatchResult} from "../types";
import {Tab, TabContent, TabsBar, VerticalGroup} from "@grafana/ui";
import React, {useState} from "react";

export interface Props {
    tracepoint: Tracepoint
    watchResults?: WatchResult[]
}

const tabs = [
    {
        label: "Tracepoint",
        active: true
    },
    {
        label: "Watches",
        active: false
    }
]

export function TracepointView({tracepoint}: {tracepoint: Tracepoint}) {
    return (
        <VerticalGroup>
            <div><span>File: </span><span>{tracepoint.path}</span></div>
            <div><span>Line: </span><span>{tracepoint.line_number}</span></div>
        </VerticalGroup>
    )
}

export function SnapshotMetaGroup({tracepoint, watchResults}: Props) {
    const [state, updateState] = useState(tabs);
    return (
        <VerticalGroup>
            <TabsBar>
                {state.map((tab, index) => {
                    return (
                        <Tab
                            key={index}
                            label={tab.label}
                            active={tab.active}
                            onChangeTab={() => updateState(state.map((tab, idx) => ({...tab, active: idx === index})))}
                        />
                    );
                })}
            </TabsBar>
            <TabContent>
                {state[0].active && <TracepointView tracepoint={tracepoint}/>}
                {state[1].active && <div>Second tab content</div>}
            </TabContent>
        </VerticalGroup>
    )
}