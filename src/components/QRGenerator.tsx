import QRCode from "react-qr-code";
import {Box, Button, VStack, Flex, HStack} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import html2canvas from "html2canvas";
import {PDFDocument} from "pdf-lib";

interface QrGeneratorProps {
    value: string;
    summaryTableRef: React.RefObject<HTMLDivElement>;
}

const QrGenerator: React.FC<QrGeneratorProps> = ({value, summaryTableRef}) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);
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

    const downloadPdf = async () => {
        if (qrCodeRef.current && summaryTableRef.current) {
            const qrCodeCanvas = await html2canvas(qrCodeRef.current);
            const summaryTableCanvas = await html2canvas(summaryTableRef.current);

            const qrCodeImgData = qrCodeCanvas.toDataURL("image/png");
            const summaryTableImgData = summaryTableCanvas.toDataURL("image/png");

            const existingPdfBytes = await fetch('src/components/qr/qr_frame.pdf').then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const page = pdfDoc.getPages()[0];
            const {width: pageWidth, height: pageHeight} = page.getSize();

            // Add the QR Code
            const qrCodeImage = await pdfDoc.embedPng(qrCodeImgData);
            const qrCodeWidth = 275;
            const qrCodeHeight = 275;

            const xQr = (pageWidth - qrCodeWidth) / 2;
            const yQr = (pageHeight - qrCodeHeight) / 2;

            page.drawImage(qrCodeImage, {
                x: xQr,
                y: yQr,
                width: qrCodeWidth,
                height: qrCodeHeight,
            });

            // Add SummaryTable to the PDF
            const summaryTableImage = await pdfDoc.embedPng(summaryTableImgData);
            const summaryTableWidth = summaryTableImage.size().width / 4;
            const summaryTableHeight = summaryTableImage.size().height / 4;

            page.drawImage(summaryTableImage, {
                x: 20,
                y: 20,
                width: summaryTableWidth,
                height: summaryTableHeight,
            });

            // Serialize the PDFDocument to bytes
            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], {type: 'application/pdf'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ccc_qr.pdf';
            link.click();
        }
    };

    const openInBrowser = () => {
        window.open(value, '_blank', 'noopener,noreferrer');
    };

    return (
        <Flex
            bg={"gray.100"}
            borderRadius="md"
            padding={1}
            justifyContent="center"
            alignItems="center"
            direction={screenWidth > 1060 ? "row" : "column"} // Stack vertically on small screens
        >
            <Box
                ref={qrCodeRef}
                position="relative"
                width="auto"
                display="flex"
                justifyContent="center"
                mb={[4, 4, 0]} // Margin bottom for spacing on smaller screens
            >
                <QRCode
                    style={{height: "auto", width: "auto"}}
                    value={value}
                />
            </Box>
            <Box
                position="relative"
                width={screenWidth > 1060 ? "auto" : "100%"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={4}
            >
                {screenWidth > 1060 ?
                    <VStack spacing={4} width="100%">
                        <Button
                            colorScheme='blue'
                            onClick={openInBrowser}
                            width="100%"
                        >
                            Open in Browser
                        </Button>
                        <Button
                            colorScheme='orange'
                            onClick={downloadPdf}
                            width="100%"
                        >
                            Download as PDF
                        </Button>
                        <Button
                            colorScheme='green'
                            width="100%"
                        >
                            Create Marker
                        </Button>
                    </VStack>
                    :
                    <HStack spacing={1} width="100%">
                        <Button
                            colorScheme='blue'
                            onClick={openInBrowser}
                            width="100%"
                            size={"sm"}
                        >
                            Open in Browser
                        </Button>
                        <Button
                            colorScheme='orange'
                            onClick={downloadPdf}
                            width="100%"
                            size={"sm"}
                        >
                            Download as PDF
                        </Button>
                        <Button
                            colorScheme='green'
                            width="100%"
                            size={"sm"}
                        >
                            Create Marker
                        </Button>
                    </HStack>
                }
            </Box>
        </Flex>
    );
};

export default QrGenerator;