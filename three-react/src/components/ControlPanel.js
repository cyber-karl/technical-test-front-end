import React from "react";

export const ControlPanel = () => {
    return (
        <div
            style={{
                position: 'absolute',
                left: '25px',
                bottom: '75px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
            }}
        >
            <b><u>Controls</u></b>
            <p>Hold Right Click: Camera Mode</p>
            <p>No Right Click: Cursor Mode</p>
            <b>While in Camera Mode</b>
            <p>- WASD Controls to Move Camera</p>
            <p>- Move Mouse to Look around</p>
            <p>- Hold Left Shift to Speed movement</p>
            <b>While in Cursor Mode</b>
            <p>- Hover Cursor over Windmill for details</p>
        </div>
    );
}
