import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

const HeaderBar: React.FC = () => {
    return (
        <Box bg="#e05c04" px={4} >
            <Flex h={'8vh'} alignItems="center" justifyContent="space-between">
                <Heading size="md" color="white">BHP</Heading>
            </Flex>
        </Box>
    );
};

export default HeaderBar;
