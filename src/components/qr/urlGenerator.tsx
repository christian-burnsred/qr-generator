
export interface UrlParams {
    operation: string;
    leadObserver: string;
    riskSelected: string;
    controlFrameworkSelected: string;
    operatingContexts: string;
    equipmentSelected: string;
}

export interface GenerateQrCodeProps {
    params: UrlParams;
}

const encodeBase64 = (obj: object): string => {
    const jsonString = JSON.stringify(obj);
    return btoa(jsonString); // Encode to Base64 for browsers
};

export const generateQrCodeUrl = async ({params}: GenerateQrCodeProps): Promise<string> => {
    // Encode the URL parameters
    const baseUrl = 'http://bhp-qr-code-evolve-platform-prototype1.burnsred.com.au/';
    const encodedParams = encodeBase64(params);
    const url = `${baseUrl}?params=${encodeURIComponent(encodedParams)}`

    // Construct the final URL
    console.log(url);
    return url;
};