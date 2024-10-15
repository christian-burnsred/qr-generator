import {ChakraProvider, HStack} from "@chakra-ui/react";
import './App.css'
import HeaderBar from "./components/Header.tsx";
import ParameterInputs from "./components/ParameterInputs.tsx";

function App() {

    return (
        <ChakraProvider>
            <HeaderBar/>
            <HStack>
                <ParameterInputs/>
            </HStack>
        </ChakraProvider>
    )
}

export default App
