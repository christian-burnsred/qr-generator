import React, {useState, useEffect, useRef} from "react";
import {Select, SingleValue} from "chakra-react-select";
import {Box, Text, Heading, HStack, Input, InputRightElement, IconButton, InputGroup} from "@chakra-ui/react";
import {operations, controls, controlFrameworks, operatingContexts, equipment} from "../data/controls";
import QRGenerator from "./QRGenerator";
import {GenerateQrCodeProps, generateQrCodeUrl} from "./qr/urlGenerator";
import SummaryTable from "./SummaryTable";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {CloseIcon} from "@chakra-ui/icons";
import {db} from "../data/firebase";
import {addDoc, getDocs, collection} from "firebase/firestore";
import {useToast} from '@chakra-ui/react';

const mapboxKey = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxKey as string;

interface Assignee {
    uid: string;
    username: string;
    name: string;
}

interface AssigneeOption {
    label: string;
    value: Assignee;
}

const ParameterInputs: React.FC = () => {
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
    const [selectedLeadObserver, setSelectedLeadObserver] = useState<string | null>(null);
    const [selectedControl, setSelectedControl] = useState<string | null>(null);
    const [selectedControlFramework, setSelectedControlFramework] = useState<string | null>(null);
    const [selectedOperatingContext, setSelectedOperatingContext] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
    const [selectedAssignee, setSelectedAssignee] = useState<Assignee | null>(null);
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
        lat: -37.81627664587091,
        lng: 144.9858104478029,
    });
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const summaryTableRef = useRef<HTMLTableElement>(null);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const toast = useToast();

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchAssignees = async () => {
            try {
                const assigneeCollection = collection(db, "assignees");
                const assigneeSnapshot = await getDocs(assigneeCollection);
                const assigneeList = assigneeSnapshot.docs.map(doc => ({
                    label: doc.data().name,
                    value: doc.data() as Assignee,
                }));
                setAssignees(assigneeList);
            } catch (error) {
                console.error("Error fetching assignees:", error);
            }
        };

        fetchAssignees();
    }, []);

    useEffect(() => {
        const urlParams: GenerateQrCodeProps = {
            params: {
                operation: selectedOperation || '',
                leadObserver: selectedLeadObserver || '',
                riskSelected: selectedControl || '',
                controlFrameworkSelected: selectedControlFramework || '',
                operatingContexts: selectedOperatingContext || '',
                equipmentSelected: selectedEquipment || ''
            }
        };

        const fetchUrl = async () => {
            try {
                const url = await generateQrCodeUrl(urlParams);
                setQrCodeUrl(url);
            } catch (error) {
                console.error("Failed to generate QR code URL", error);
            }
        };

        fetchUrl();
    }, [selectedOperation, selectedLeadObserver, selectedControl, selectedControlFramework, selectedOperatingContext, selectedEquipment]);

    useEffect(() => {
        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [userLocation.lng, userLocation.lat],
                zoom: 14,
            });

            // Add a solid blue dot for the user's location
            const userMarkerElement = document.createElement('div');
            userMarkerElement.className = 'user-marker';
            userMarkerElement.style.backgroundColor = 'blue'; // Solid blue color
            userMarkerElement.style.width = '15px'; // Adjust size
            userMarkerElement.style.height = '15px'; // Adjust size
            userMarkerElement.style.borderRadius = '50%'; // Make it circular
            userMarkerElement.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.9)';

            // Create the user marker and add it to the map
            new mapboxgl.Marker(userMarkerElement)
                .setLngLat([userLocation.lng, userLocation.lat])
                .addTo(mapRef.current as mapboxgl.Map);

            mapRef.current.on('click', (e) => {
                const coordinates = e.lngLat;

                setLatLng({
                    lat: coordinates.lat,
                    lng: coordinates.lng
                });

                if (markerRef.current) {
                    markerRef.current.remove();
                }

                markerRef.current = new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .addTo(mapRef.current as mapboxgl.Map);
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [userLocation]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setUserLocation({
                        lat: latitude,
                        lng: longitude,
                    });
                    console.log("User's location:", {latitude, longitude});
                },
                (error) => {
                    console.error("Error fetching user's location:", error);
                },
                {enableHighAccuracy: true}
            );
        }
    }, []);

    const operationOptions = Object.entries(operations || {}).map(([key, value]) => ({
        label: `${key} - ${value.site}`,
        value: key,
    }));

    const controlOptions = Object.entries(controls || {}).map(([key, value]) => ({
        label: `${key} - ${value.label}`,
        value: key,
        icon: value.icon,
    }));

    const controlFrameworkOptions = selectedControl
        ? Object.entries(controlFrameworks[selectedControl] || {}).map(([key, value]) => ({
            label: `${key} - ${value.control}`,
            value: key,
        }))
        : [];

    const operatingContextOptions = selectedControlFramework
        ? Object.entries(operatingContexts[selectedControlFramework] || {}).map(([key, value]) => ({
            label: `${key} - ${value.operating_context}`,
            value: key,
        }))
        : [];

    const equipmentOptions = selectedOperatingContext
        ? Object.entries(equipment[selectedOperatingContext] || {}).map(([key, value]) => ({
            label: `${key} - ${value.equipment}`,
            value: key,
        }))
        : [];

    const handleOperationChange = (option: SingleValue<{ value: string }>) => {
        const value = option?.value || null;
        setSelectedOperation(value);
        setSelectedFormType(null);
        setSelectedLeadObserver(null);
        setSelectedControl(null);
        setSelectedControlFramework(null);
        setSelectedOperatingContext(null);
        setSelectedAssignee(null);
        setSelectedEquipment(null);
    };

    const handleControlChange = (option: SingleValue<{ value: string }>) => {
        setSelectedControl(option?.value || null);
        setSelectedControlFramework(null);
        setSelectedOperatingContext(null);
        setSelectedEquipment(null);
    };

    const handleFrameworkChange = (option: SingleValue<{ value: string }>) => {
        setSelectedControlFramework(option?.value || null);
        setSelectedOperatingContext(null);
        setSelectedEquipment(null);
    };

    const handleContextChange = (option: SingleValue<{ value: string }>) => {
        setSelectedOperatingContext(option?.value || null);
        setSelectedEquipment(null);
    };

    const handleEquipmentChange = (option: SingleValue<{ value: string }>) => {
        setSelectedEquipment(option?.value || null);
        setSelectedAssignee(null);
    };

    const createMarker = async () => {
        if (selectedOperatingContext && selectedFormType && selectedControl && selectedEquipment &&
            selectedControlFramework && latLng && selectedOperation && qrCodeUrl) {

            try {
                await addDoc(collection(db, "markers"), {
                    assignee: selectedAssignee,
                    context: operatingContexts[selectedControlFramework][selectedOperatingContext].operating_context,
                    control: controls[selectedControl].label,
                    equipment: equipment[selectedOperatingContext][selectedEquipment].equipment,
                    form: selectedFormType,
                    framework: controlFrameworks[selectedControl][selectedControlFramework].control,
                    location: latLng,
                    operation: operations[selectedOperation].site,
                    url: qrCodeUrl,
                });
                toast({
                    title: 'Marker created.',
                    description: 'Marker successfully created!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            } catch (e: any) {
                toast({
                    title: 'Error adding marker.',
                    description: `Error: ${e.message}`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            }
        } else {
            toast({
                title: 'Input Error.',
                description: 'Error - Fill all inputs to create a marker.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        }
    };

    return (
        <HStack
            width={"100vw"}
            spacing={4}
            align="start"
            flexDirection={screenWidth < 950 ? "column" : "row"}
        >
            <Box position="relative" bg="gray.100" width={screenWidth < 950 ? "100%" : "50%"} height="100%" padding={4}>
                <Heading>Parameters</Heading>
                <Text as='b' fontSize={'sm'}>Operation</Text>
                <Select
                    options={operationOptions}
                    value={operationOptions.find(option => option.value === selectedOperation) || null}
                    onChange={handleOperationChange}
                    isClearable
                />
                <Text as='b' fontSize={'sm'}>Form Type</Text>
                <Select
                    options={[
                        {label: "CCC", value: "CCC"},
                        {label: "FCC", value: "FCC"},
                    ]}
                    value={selectedFormType ? {label: selectedFormType.toUpperCase(), value: selectedFormType} : null}
                    isDisabled={!selectedOperation}
                    isClearable
                    onChange={(option) => setSelectedFormType(option?.value || null)}
                />
                <Text as='b' fontSize={'sm'}>Controls</Text>
                <Select
                    options={controlOptions}
                    value={controlOptions.find(option => option.value === selectedControl) || null}
                    isDisabled={!selectedOperation}
                    onChange={handleControlChange}
                    isClearable
                />
                <Text as='b' fontSize={'sm'}>Control Framework</Text>
                <Select
                    options={controlFrameworkOptions}
                    value={controlFrameworkOptions.find(option => option.value === selectedControlFramework) || null}
                    isDisabled={!selectedControl}
                    onChange={handleFrameworkChange}
                    isClearable
                />
                <Text as='b' fontSize={'sm'}>Operating Context</Text>
                <Select
                    options={operatingContextOptions}
                    value={operatingContextOptions.find(option => option.value === selectedOperatingContext) || null}
                    isDisabled={!selectedControlFramework}
                    onChange={handleContextChange}
                    isClearable
                />
                <Text as='b' fontSize={'sm'}>Equipment</Text>
                <Select
                    options={equipmentOptions}
                    value={equipmentOptions.find(option => option.value === selectedEquipment) || null}
                    isDisabled={!selectedOperatingContext}
                    onChange={handleEquipmentChange}
                    isClearable
                />
                <Text as='b' fontSize={'sm'}>Assign</Text>
                <Select
                    options={assignees}
                    value={selectedAssignee ? {label: selectedAssignee.name, value: selectedAssignee} : null}
                    isDisabled={!selectedEquipment}
                    onChange={(option) => setSelectedAssignee(option?.value || null)}
                    isClearable
                />
                <Text as="b" fontSize="sm">Location (Lat, Lng)</Text>
                <InputGroup mb={4}>
                    <Input
                        value={latLng ? `${latLng.lat}, ${latLng.lng}` : ""}
                        readOnly
                        placeholder="Select a location on the map"
                    />
                    {latLng && (
                        <InputRightElement>
                            <IconButton
                                aria-label="Clear location"
                                icon={<CloseIcon/>}
                                size="xs"
                                onClick={() => {
                                    setLatLng(null);
                                    if (markerRef.current) {
                                        markerRef.current.remove();
                                        markerRef.current = null;
                                    }
                                }}
                                bg="transparent"
                            />
                        </InputRightElement>
                    )}
                </InputGroup>
                <Box height="300px" ref={mapContainerRef} style={{width: "100%"}}/>
            </Box>

            <Box position="relative" width={screenWidth < 950 ? "100%" : "50%"} height="92vh" padding={4}>
                <QRGenerator value={qrCodeUrl} summaryTableRef={summaryTableRef} createMarker={createMarker}/>
                <SummaryTable
                    ref={summaryTableRef}
                    selectedOperation={selectedOperation}
                    selectedFormType={selectedFormType}
                    selectedControl={selectedControl}
                    selectedControlFramework={selectedControlFramework}
                    selectedOperatingContext={selectedOperatingContext}
                    selectedEquipment={selectedEquipment}
                    selectedAssignee={selectedAssignee ? selectedAssignee.name : null}
                    locationCoords={latLng}
                />
            </Box>
        </HStack>
    );
};

export default ParameterInputs;