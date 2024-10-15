import {
    FaCar,
    FaTrainSubway,
    FaRegSquareCaretUp,
    FaBoltLightning,
    FaArrowsDownToLine,
    FaGears,
    FaArrowsTurnToDots
} from 'react-icons/fa6';
import React from "react";

// Control Interface
interface Control {
    icon: React.ElementType;
    label: string;
}

// Control Framework Interface
interface ControlFramework {
    control: string;
}

// Operating Context Interface
interface OperatingContext {
    operating_context: string;
}

// Equipment Interface
interface EquipmentItem {
    equipment: string;
}


interface Location {
    site: string;
    location: [number, number][];
}

export const operations: { [key: string]: Location } = {
    'NMKM': {
        site: 'Mt Keith',
        location: [
            [0, 0], // Bottom-left corner (longitude, latitude)
            [0, 0]  // Top-right corner (longitude, latitude)
        ]
    },
    'CNM': {
        site: 'Cliffs',
        location: [
            [0, 0], // Bottom-left corner (longitude, latitude)
            [0, 0]  // Top-right corner (longitude, latitude)
        ]
    },
    'NLNM': {
        site: 'Leinster',
        location: [
            [0, 0], // Bottom-left corner (longitude, latitude)
            [0, 0]  // Top-right corner (longitude, latitude)
        ]
    },
    'NPI': {
        site: 'Non-Process Infrastructure',
        location: [
            [0, 0], // Bottom-left corner (longitude, latitude)
            [0, 0]  // Top-right corner (longitude, latitude)
        ]
    },
    'BRO': {
        site: 'BurnsRED Office',
        location: [
            [144.98176569919508, -37.818534455210106],
            [144.9908777222061, -37.811264469979434]
        ]
    },
    'WFH': {
        site: 'BurnsRED WFH Office',
        location: [
            [144.8949274511054, -37.76481882313553],
            [144.907305, -37.755989]
        ]
    },
};


export const leadObservers: { [key: string]: string } = {
    '20000001': 'Justin Chancellor',
    '20000002': 'Daniel Carey',
    '20000003': 'Maynard James',
    '20000004': 'Adam Jones',
};

// Control Data
export const controls: { [key: string]: Control } = {
    '30000000': {icon: FaCar, label: 'Vehicle and Mobile Equipment'},
    '40000000': {icon: FaTrainSubway, label: 'Rail'},
    '50000000': {icon: FaRegSquareCaretUp, label: 'Lifting'},
    '60000000': {icon: FaBoltLightning, label: 'Electrical'},
    '70000000': {icon: FaArrowsDownToLine, label: 'Falling object'},
    '80000000': {icon: FaGears, label: 'Crushing'},
    '90000000': {icon: FaArrowsTurnToDots, label: 'Mat. Moving'},
};

// Control Framework Data
export const controlFrameworks: { [key: string]: { [key: string]: ControlFramework } } = {
    '30000000': {
        '31000000': {control: "Crash, Collision, Overturn on Mine Site"},
        '32000000': {control: "Pre-start Inspections"},
        '33000000': {control: "Use mobile plant"},
        '34000000': {control: "General Safety Rules for Operator"},
        '35000000': {control: "Warning Signals and Reversing"}
    },
    '40000000': {
        '41000000': {control: "Control 1"},
        '42000000': {control: "Control 2"}
    },
    '50000000': {
        '51000000': {control: "Control 1"},
        '52000000': {control: "Control 2"},
    },
    '60000000': {
        '61000000': {control: "Control 1"},
        '62000000': {control: "Control 2"}
    },
    '70000000': {
        '71000000': {control: "Control 1"},
        '72000000': {control: "Control 2"}
    },
    '80000000': {
        '81000000': {control: "Control 1"},
        '82000000': {control: "Control 2"}
    },
    '90000000': {
        '91000000': {control: "Control 1"},
        '92000000': {control: "Control 2"}
    }
};

// Operating Context Data
export const operatingContexts: { [key: string]: { [key: string]: OperatingContext } } = {
    "31000000": {
        '31100000': {operating_context: "Underground"},
        '31200000': {operating_context: "Surface"},
        '31300000': {operating_context: "Onsite non-Mining"},
        '31400000': {operating_context: "Offsite"}
    },
    "32000000": {
        '32100000': {operating_context: "Operating Context 1"},
        '32200000': {operating_context: "Operating Context 2"},
    },
    "33000000": {
        '33100000': {operating_context: "Operating Context 1"},
        '33200000': {operating_context: "Operating Context 2"},
    },
    "34000000": {
        '34100000': {operating_context: "Operating Context 1"},
        '34200000': {operating_context: "Operating Context 2"},
    },
    "35000000": {
        '35100000': {operating_context: "Operating Context 1"},
        '35200000': {operating_context: "Operating Context 2"},
    },
    "41000000": {
        '41100000': {operating_context: "Operating Context 1"},
        '41200000': {operating_context: "Operating Context 2"},
    },
    "42000000": {
        '42100000': {operating_context: "Operating Context 1"},
        '42200000': {operating_context: "Operating Context 2"},
    },
    "51000000": {
        '51100000': {operating_context: "Operating Context 1"},
        '51200000': {operating_context: "Operating Context 2"},
    },
    "52000000": {
        '52100000': {operating_context: "Operating Context 1"},
        '52200000': {operating_context: "Operating Context 2"},
    },
    "61000000": {
        '61100000': {operating_context: "Operating Context 1"},
        '61200000': {operating_context: "Operating Context 2"},
    },
    "62000000": {
        '62100000': {operating_context: "Operating Context 1"},
        '62200000': {operating_context: "Operating Context 2"},
    },
    "71000000": {
        '71100000': {operating_context: "Operating Context 1"},
        '71200000': {operating_context: "Operating Context 2"},
    },
    "72000000": {
        '72100000': {operating_context: "Operating Context 1"},
        '72200000': {operating_context: "Operating Context 2"},
    },
    "81000000": {
        '81100000': {operating_context: "Operating Context 1"},
        '81200000': {operating_context: "Operating Context 2"},
    },
    "82000000": {
        '82100000': {operating_context: "Operating Context 1"},
        '82200000': {operating_context: "Operating Context 2"},
    },
    "91000000": {
        '91100000': {operating_context: "Operating Context 1"},
        '91200000': {operating_context: "Operating Context 2"},
    },
    "92000000": {
        '92100000': {operating_context: "Operating Context 1"},
        '92200000': {operating_context: "Operating Context 2"},
    },
};

// Equipment Data
export const equipment: { [key: string]: { [key: string]: EquipmentItem } } = {
    "31200000": {
        "31110000": {equipment: "Off-highway Truck"},
        "31120000": {equipment: "Wheel Loaders"},
        "31130000": {equipment: "Rubber Tyred SME"},
        "31140000": {equipment: "Dozers"},
        "31150000": {equipment: "Drills and tracked SME"},
        "31160000": {equipment: "Excavators/ Shovels"},
        "31170000": {equipment: "Off-highway haulers"},
    },
    "31100000": {
        "31210000": {equipment: "UG ME"},
        "31220000": {equipment: "UG Loaders, bogger"},
        "31230000": {equipment: "UG shuttle cars, miners"},
    },
    "31300000": {
        "31310000": {equipment: "Off-highway Truck"},
        "31320000": {equipment: "Wheel Loaders"},
        "31330000": {equipment: "Rubber Tyred SME"},
        "31340000": {equipment: "Dozers"},
    },
    "31400000": {
        "31410000": {equipment: "Off-highway Truck"},
        "31420000": {equipment: "Wheel Loaders"},
        "31430000": {equipment: "Rubber Tyred SME"},
        "31440000": {equipment: "Dozers"},
    },
    "32100000": {
        "32111000": {equipment: "Off-highway Truck"},
        "32120000": {equipment: "Wheel Loaders"},
    },
    "32200000": {
        "32210000": {equipment: "Off-highway Truck"},
        "32220000": {equipment: "Wheel Loaders"},
    },
    "33100000": {
        "33110000": {equipment: "Off-highway Truck"},
        "33120000": {equipment: "Wheel Loaders"},
    },
    "33200000": {
        "33210000": {equipment: "Off-highway Truck"},
        "33220000": {equipment: "Wheel Loaders"},
    },
    "34100000": {
        "34110000": {equipment: "Off-highway Truck"},
        "34120000": {equipment: "Wheel Loaders"},
    },
    "34200000": {
        "34210000": {equipment: "Off-highway Truck"},
        "34220000": {equipment: "Wheel Loaders"},
    },
    "35100000": {
        "35110000": {equipment: "Off-highway Truck"},
        "35120000": {equipment: "Wheel Loaders"},
    },
    "35200000": {
        "35210000": {equipment: "Off-highway Truck"},
        "35220000": {equipment: "Wheel Loaders"},
    },
    "41100000": {
        "41110000": {equipment: "Equipment Item 1"},
        "41120000": {equipment: "Equipment Item 2"},
    },
    "41200000": {
        "41210000": {equipment: "Equipment Item 1"},
        "41220000": {equipment: "Equipment Item 2"},
    },
    "42100000": {
        "42110000": {equipment: "Equipment Item 1"},
        "42120000": {equipment: "Equipment Item 2"},
    },
    "42200000": {
        "42210000": {equipment: "Equipment Item 1"},
        "42220000": {equipment: "Equipment Item 2"},
    },
    "51100000": {
        "51110000": {equipment: "Equipment Item 1"},
        "51120000": {equipment: "Equipment Item 2"},
    },
    "51200000": {
        "51210000": {equipment: "Equipment Item 1"},
        "51220000": {equipment: "Equipment Item 2"},
    },
    "52100000": {
        "52110000": {equipment: "Equipment Item 1"},
        "52120000": {equipment: "Equipment Item 2"},
    },
    "52200000": {
        "52210000": {equipment: "Equipment Item 1"},
        "52220000": {equipment: "Equipment Item 2"},
    },
    "61100000": {
        "61110000": {equipment: "Equipment Item 1"},
        "61120000": {equipment: "Equipment Item 2"},
    },
    "61200000": {
        "61210000": {equipment: "Equipment Item 1"},
        "61220000": {equipment: "Equipment Item 2"},
    },
    "62100000": {
        "62110000": {equipment: "Equipment Item 1"},
        "62120000": {equipment: "Equipment Item 2"},
    },
    "62200000": {
        "62210000": {equipment: "Equipment Item 1"},
        "62220000": {equipment: "Equipment Item 2"},
    },
    "71100000": {
        "71110000": {equipment: "Equipment Item 1"},
        "71120000": {equipment: "Equipment Item 2"},
    },
    "71200000": {
        "71210000": {equipment: "Equipment Item 1"},
        "71220000": {equipment: "Equipment Item 2"},
    },
    "72100000": {
        "72110000": {equipment: "Equipment Item 1"},
        "72120000": {equipment: "Equipment Item 2"},
    },
    "72200000": {
        "72210000": {equipment: "Equipment Item 1"},
        "72220000": {equipment: "Equipment Item 2"},
    },
    "81100000": {
        "81110000": {equipment: "Equipment Item 1"},
        "81120000": {equipment: "Equipment Item 2"},
    },
    "81200000": {
        "81210000": {equipment: "Equipment Item 1"},
        "81220000": {equipment: "Equipment Item 2"},
    },
    "82100000": {
        "82110000": {equipment: "Equipment Item 1"},
        "82120000": {equipment: "Equipment Item 2"},
    },
    "82200000": {
        "82210000": {equipment: "Equipment Item 1"},
        "82220000": {equipment: "Equipment Item 2"},
    },
    "91100000": {
        "91110000": {equipment: "Equipment Item 1"},
        "91120000": {equipment: "Equipment Item 2"},
    },
    "91200000": {
        "91210000": {equipment: "Equipment Item 1"},
        "91220000": {equipment: "Equipment Item 2"},
    },
    "92100000": {
        "92110000": {equipment: "Equipment Item 1"},
        "92120000": {equipment: "Equipment Item 2"},
    },
    "92200000": {
        "92210000": {equipment: "Equipment Item 1"},
        "92220000": {equipment: "Equipment Item 2"},
    },
};
