import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';

const PotteryModal = ({ existingPottery }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState(existingPottery?.name || '');
    const [stage, setStage] = useState(existingPottery?.status || 'greenware');
    const [glazeCombo, setGlazeCombo] = useState(existingPottery?.glaze_combo || []);
    const [specialTechniques, setSpecialTechniques] = useState(existingPottery?.specialTechniques || '');

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleFileChange = (event) => setPhoto(event.target.files[0]);

    const handleNameChange = (event) => setName(event.target.value);

    const handleStageChange = (event) => setStage(event.target.value);

    const handleSpecialTechniquesChange = (event) => setSpecialTechniques(event.target.value);

    const handleAddGlazeCombo = () => {
        const glaze = {
            name: prompt("Enter Glaze Name:"),
            firing_kiln_type: prompt("Enter Firing Kiln Type (electric or gas):", "electric"),
        };
        setGlazeCombo([...glazeCombo, glaze]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (photo) formData.append('photo', photo);
        formData.append('name', name);
        formData.append('stage', stage);
        formData.append('specialTechniques', specialTechniques);
        formData.append('glaze_combo', JSON.stringify(glazeCombo));

        try {
            if (existingPottery) {
                const response = await axios.put(`http://localhost:5001/api/pottery/${existingPottery._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('Pottery updated successfully:', response.data);
            } else {
                const response = await axios.post('http://localhost:5001/api/pottery/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('Pottery created successfully:', response.data);
            }
            handleClose();
        } catch (error) {
            console.error('Error saving pottery:', error);
        }
    };

    return (
        <>
            <Button colorScheme="teal" onClick={handleOpen}>
                {existingPottery ? 'Edit Pottery' : 'Create Pottery'}
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{existingPottery ? 'Edit Pottery' : 'Create Pottery'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <FormControl mb={4}>
                                <FormLabel htmlFor="photo">Upload Photo</FormLabel>
                                <Input type="file" id="photo" name="photo" onChange={handleFileChange} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="name">Pottery Name</FormLabel>
                                <Input 
                                    type="text"
                                    id="name" 
                                    value={name}
                                    onChange={handleNameChange} 
                                    required 
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="stage">Select Stage</FormLabel>
                                <Select id="stage" value={stage} onChange={handleStageChange} required>
                                    <option value="greenware">Greenware</option>
                                    <option value="bisque">Bisque</option>
                                    <option value="glazed">Glazed</option>
                                    <option value="fired">Fired</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="specialTechniques">Special Techniques</FormLabel>
                                <Input 
                                    type="text"
                                    id="specialTechniques"
                                    value={specialTechniques}
                                    onChange={handleSpecialTechniquesChange}
                                    placeholder="e.g., Slip trailing, sgraffito"
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Glaze Combinations</FormLabel>
                                {glazeCombo.map((glaze, index) => (
                                    <Box key={index} mb={2}>
                                        <Text>{glaze.name} ({glaze.firing_kiln_type})</Text>
                                    </Box>
                                ))}
                                <Button onClick={handleAddGlazeCombo} colorScheme="gray" mt={2}>Add Glaze</Button>
                            </FormControl>

                            <Button colorScheme="teal" type="submit" width="full">
                                {existingPottery ? 'Update Pottery' : 'Create Pottery'}
                            </Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PotteryModal;
