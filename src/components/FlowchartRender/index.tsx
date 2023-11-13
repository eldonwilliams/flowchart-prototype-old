import PanView, { PanViewCoordinatesToGlobal, PanViewState } from "../PanView";
import './FlowchartRender.css';
import { Fragment, useEffect, useState } from "react";
import Canvas from "../../Canvas";
import FlowchartComponent, { FlowchartComponentTypes } from "../../FlowchartComponents";
import RectangleComponent from "./RectangleComponent";
import CircleComponent from "./CircleComponent";

const ComponentRenders = {
    [FlowchartComponentTypes.Rectangle]: RectangleComponent,
    [FlowchartComponentTypes.Circle]: CircleComponent,
}

export interface FlowchartRenderProps {

}

/**
 * A component whose job is to render a flowchart, given some data
 * Limited interaction
 * @returns 
 */
export default function FlowchartRender(props: FlowchartRenderProps) {
    const [renderStateRef, setRenderStateRef] = useState<PanViewState | null>();

    const [elements, setElements] = useState<FlowchartComponent[]>([]);

    useEffect(() => {
        setElements([
            { x: 30, y: 10, connections: [], height: 20, width: 20, type: FlowchartComponentTypes.Rectangle, },
            { x: 30, y: 50, connections: [], height: 20, width: 40, type: FlowchartComponentTypes.Circle, }
        ])
    }, []);

    return (
        <>
            <PanView
                stateFunction={setRenderStateRef}
                viewChildren={
                        <Canvas
                            renderFn={(ctx) => {
                                if (!renderStateRef) return;
                                ctx.strokeStyle = "#000";
                                ctx.beginPath();
                                const [x1, y1] = PanViewCoordinatesToGlobal(renderStateRef, 10, 10);
                                const [x2, y2] = PanViewCoordinatesToGlobal(renderStateRef, 30, 30);
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.stroke();
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                }
            >
                {elements.map((v, i) => <Fragment key={i}>
                    {(ComponentRenders[v.type])({ ...v, setState: setElements, })}
                </Fragment>)}
            </PanView>
        </>
    );
}