import {useState, useEffect, useRef} from "react";
import {Select} from "chakra-react-select";
import {Box, Text, Heading, HStack, Input, InputRightElement, IconButton, InputGroup} from "@chakra-ui/react";
import {operations, controls, controlFrameworks, operatingContexts, equipment} from "../data/controls";
import QRGenerator from "./QRGenerator.tsx";
import {GenerateQrCodeProps, generateQrCodeUrl} from "./qr/urlGenerator.tsx";
import SummaryTable from "./SummaryTable.tsx";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import {CloseIcon} from "@chakra-ui/icons";


// TODO - Hide, make secret
const mapboxKey = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxKey;

const ParameterInputs: React.FC = () => {
    // State to keep track of selected values
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [selectedLeadObserver, setSelectedLeadObserver] = useState<string | null>(null);
    const [selectedControl, setSelectedControl] = useState<string | null>(null);
    const [selectedControlFramework, setSelectedControlFramework] = useState<string | null>(null);
    const [selectedOperatingContext, setSelectedOperatingContext] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
        lat: -37.81627664587091, // Default BR Office
        lng: 144.9858104478029,
    });
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null); // Ref to store the marker

    const summaryTableRef = useRef<HTMLTableElement>(null);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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

    // Initialize Mapbox when the component mounts
    useEffect(() => {
        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                center: userLocation, // Initial center [lng, lat]
                zoom: 14, // Initial zoom level
            });

            // Event listener for map click
            mapRef.current.on('click', (e) => {
                const coordinates = e.lngLat;

                // Set lat/lng in state
                setLatLng({
                    lat: coordinates.lat,
                    lng: coordinates.lng
                });

                // Remove the previous marker, if any
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                // Add a new marker to the clicked location
                markerRef.current = new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .addTo(mapRef.current as mapboxgl.Map);
            });
        }

        return () => {
            // Clean up the map when the component unmounts
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;

                    // Update state with the user's current location
                    setUserLocation({
                        lat: latitude,
                        lng: longitude,
                    });

                    // Log the position inside the success callback
                    console.log("User's location:", {latitude, longitude});
                },
                (error) => {
                    console.error("Error fetching user's location:", error);
                },
                {enableHighAccuracy: true}
            );
        }
    }, []);

    // Convert objects into arrays of options with key-value formatting
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

    const handleOperationChange = (option: { value: string } | null) => {
        const value = option?.value || null;
        setSelectedOperation(value);
        setSelectedLeadObserver(null);
        setSelectedControl(null);
        setSelectedControlFramework(null);
        setSelectedOperatingContext(null);
        setSelectedEquipment(null);
    };

    return (
        <HStack
            width={"100vw"}
            spacing={4}
            align="start"
            flexDirection={screenWidth < 950 ? "column" : "row"}  // Stack vertically for small screens
        >
            <Box position="relative" bg="gray.100" width={screenWidth < 950 ? "100%" : "50%"} height="100%" padding={4}>
                <Heading>Parameters</Heading>
                <Text as='b' fontSize={'sm'}>Operation</Text>
                <Select
                    options={operationOptions}
                    value={operationOptions.find(option => option.value === selectedOperation) || null}
                    onChange={handleOperationChange}
                />
                <Text as='b' fontSize={'sm'}>Controls</Text>
                <Select
                    options={controlOptions}
                    value={controlOptions.find(option => option.value === selectedControl) || null}
                    isDisabled={!selectedOperation}
                    onChange={(option) => setSelectedControl(option?.value || null)}
                />
                <Text as='b' fontSize={'sm'}>Control Framework</Text>
                <Select
                    options={controlFrameworkOptions}
                    value={controlFrameworkOptions.find(option => option.value === selectedControlFramework) || null}
                    isDisabled={!selectedControl}
                    onChange={(option) => setSelectedControlFramework(option?.value || null)}
                />
                <Text as='b' fontSize={'sm'}>Operating Context</Text>
                <Select
                    options={operatingContextOptions}
                    value={operatingContextOptions.find(option => option.value === selectedOperatingContext) || null}
                    isDisabled={!selectedControlFramework}
                    onChange={(option) => setSelectedOperatingContext(option?.value || null)}
                />
                <Text as='b' fontSize={'sm'}>Equipment</Text>
                <Select
                    options={equipmentOptions}
                    value={equipmentOptions.find(option => option.value === selectedEquipment) || null}
                    isDisabled={!selectedOperatingContext}
                    onChange={(option) => setSelectedEquipment(option?.value || null)}
                />

                {/* Location Input */}
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
                                    setLatLng(null); // Clear the location
                                    if (markerRef.current) {
                                        markerRef.current.remove(); // Remove the marker
                                        markerRef.current = null;
                                    }
                                }}
                                bg="transparent"
                            />
                        </InputRightElement>
                    )}
                </InputGroup>

                {/* Mapbox Map */}
                <Box height="300px" ref={mapContainerRef} style={{width: "100%"}}/>
            </Box>

            <Box position="relative" width={screenWidth < 950 ? "100%" : "50%"} height="92vh" padding={4}>
                <QRGenerator value={qrCodeUrl} summaryTableRef={summaryTableRef}/>
                <SummaryTable
                    ref={summaryTableRef}
                    selectedOperation={selectedOperation}
                    selectedControl={selectedControl}
                    selectedControlFramework={selectedControlFramework}
                    selectedOperatingContext={selectedOperatingContext}
                    selectedEquipment={selectedEquipment}
                    locationCoords={latLng}
                />
            </Box>
        </HStack>
    );

};

export default ParameterInputs;
