import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Image, Grid, Checkbox, Card, CardBody, Stack } from '@chakra-ui/react';
import axios from 'axios';

const PotteryGallery = () => {
    const [potteries, setPotteries] = useState([]);
    const [showInProgress, setShowInProgress] = useState(false);

    useEffect(() => {
        const fetchPotteries = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/pottery');
                setPotteries(response.data);
            } catch (error) {
                console.error('Error fetching pottery pieces:', error);
            }
        };
        fetchPotteries();
    }, []);

    const handleCheckboxChange = (event) => {
        setShowInProgress(event.target.checked);
    };

    const filteredPotteries = showInProgress
        ? potteries.filter(pottery => pottery.status !== 'fired')
        : potteries;

    return (
        <Box padding={5}>
            <Heading as="h2" size="lg" mb={4}>Pottery Gallery</Heading>
            <Checkbox
                isChecked={showInProgress}
                onChange={handleCheckboxChange}
                mb={4}
            >
                Show Only In-Progress Pottery (not "fired")
            </Checkbox>

            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
                {filteredPotteries.map((pottery) => (
                    <Card key={pottery._id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Image
                            src={`http://localhost:5001/uploads/${pottery.photos[pottery.photos.length - 1]?.photoUrl}`}
                            alt={`${pottery.name} photo`}
                            boxSize="250px"
                            objectFit="cover"
                        />
                        <CardBody>
                            <Stack spacing={3}>
                                <Heading as="h3" size="md">{pottery.name}</Heading>
                                <Text>Status: {pottery.status}</Text>
                                <Text>Created At: {new Date(pottery.createdAt).toLocaleDateString()}</Text>
                                {pottery.updatedAt && (
                                    <Text>Last Updated: {new Date(pottery.updatedAt).toLocaleDateString()}</Text>
                                )}
                            </Stack>
                        </CardBody>
                    </Card>
                ))}
            </Grid>
        </Box>
    );
};

export default PotteryGallery;
