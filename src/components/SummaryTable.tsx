import {Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {
    controlFrameworks,
    controls,
    equipment,
    operatingContexts,
    operations
} from "../data/controls.ts";
import {forwardRef} from "react";

interface SummaryProps {
    selectedOperation: string | null,
    selectedControl: string | null,
    selectedControlFramework: string | null,
    selectedOperatingContext: string | null,
    selectedEquipment: string | null,
    locationCoords:  { lat: number, lng: number } | null
}

const SummaryTable = forwardRef<HTMLTableElement, SummaryProps>(({selectedOperation, selectedControl, selectedControlFramework,
                          selectedOperatingContext, selectedEquipment, locationCoords}, ref) => {
    return (
        <Table ref={ref} variant="simple" size={'md'}>
            <Thead>
                <Tr>
                    <Th>Parameter</Th>
                    <Th>Value</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>Operation</Td>
                    <Td>{selectedOperation ? operations[selectedOperation].site : null}</Td>
                </Tr>
                <Tr>
                    <Td>Control</Td>
                    <Td>{selectedControl ? controls[selectedControl].label : null}</Td>
                </Tr>
                <Tr>
                    <Td>Control Framework</Td>
                    <Td>{selectedControl && selectedControlFramework ? controlFrameworks[selectedControl][selectedControlFramework].control : null}</Td>
                </Tr>
                <Tr>
                    <Td>Operating Context</Td>
                    <Td>{selectedControlFramework && selectedOperatingContext ? operatingContexts[selectedControlFramework][selectedOperatingContext].operating_context : null}</Td>
                </Tr>
                <Tr>
                    <Td>Equipment</Td>
                    <Td>{selectedEquipment && selectedOperatingContext ? equipment[selectedOperatingContext][selectedEquipment].equipment : null}</Td>
                </Tr>
                <Tr>
                    <Td>Location</Td>
                    <Td>{locationCoords ? `${locationCoords['lat']}, ${locationCoords['lng']}` : null}</Td>
                </Tr>
            </Tbody>
        </Table>
    );
});

export default SummaryTable;