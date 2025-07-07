import React, { useState } from 'react';

const FarmMenu = ({ farms, onFarmSelect }) => {
    const [selectedFarm, setSelectedFarm] = useState(null);

    const handleFarmSelect = (event) => {
        const farmId = event.target.value;
        setSelectedFarm(farmId);
        onFarmSelect(farmId);
    };

    return (
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
            <label htmlFor="farm-select">Select a Farm: </label>
            <select id="farm-select" value={selectedFarm || ''} onChange={handleFarmSelect}>
                <option value="" disabled>Choose a farm</option>
                {farms.map(farm => (
                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
            </select>
        </div>
    );
};

export default FarmMenu;
