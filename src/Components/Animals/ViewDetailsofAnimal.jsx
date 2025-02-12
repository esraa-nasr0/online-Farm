import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { AnimalContext } from '../../Context/AnimalContext';
import Swal from 'sweetalert2';
import ViewAnimalMating from './ViewAnimalMating';
import ViewAnimalWeight from './ViewAnimalWeight';
import ViewAnimalBreed from './ViewAnimalBreed';
import ViewAnimalVaccine from './ViewAnimalVaccine';

export default function ViewDetailsofAnimal() {
    const { id } = useParams();  // Get the animal id from the URL
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [animalData, setAnimalData] = useState(null);
    const navigate = useNavigate();
    const { removeAnimals } = useContext(AnimalContext);

    let Authorization = localStorage.getItem('Authorization');
    let headers = {
        Authorization: `Bearer ${Authorization}`,
    };

    // Fetch animal data based on the animal id
    async function submitAnimals() {
        setIsLoading(true);
        setError(null);
        try {
            let { data } = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/animal/getsinglanimals/${id}`,
                { headers }
            );

            if (data.status === 'success') {
                setIsLoading(false);
                setAnimalData(data.data.animal);  // Set the animal data to state
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message);
        }
    }

    useEffect(() => {
        if (id) {  // Ensure the id is available before calling the API
            submitAnimals();
        }
    }, []);

    const removeItem = async (id) => {
        await removeAnimals(id);
        navigate('/animals');  // After deletion, navigate back to the animals list page
    };

    const handleClick = (id) => {
        Swal.fire({
            title: "هل تريد الاستمرار؟",
            icon: "question",
            confirmButtonText: "نعم",
            cancelButtonText: "لا",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                removeItem(id);
            }
        });
    };

    const editAnimal = (id) => {
        navigate(`/editAnimal/${id}`);
    };

    // Navigate to add new animal page
    const addNewAnimal = () => {
        navigate('/animalsDetails');
    };

    return (
        <div className="container">
            <div className="title2">View Details of Animal</div>
            <div className='mating-record-wrapper'>
                <div className="mating-record-header">
                    <h2>Animal RECORD</h2>
                    <button onClick={addNewAnimal} className="add-record-btn">
                        <FaPlusCircle /> Add New Record
                    </button>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : animalData ? (
                    <div className="animal-details">
                        <div className="mating-record-list">
                            <div className="mating-record-item">
                                <div className="mating-record-info">
                                    <ul>
                                        <li><strong>Tag ID:</strong> {animalData.tagId}</li>
                                        <li><strong>Animal Type:</strong> {animalData.animalType}</li>
                                        <li><strong>Breed:</strong> {animalData.breed}</li>
                                        <li><strong>Gender:</strong> {animalData.gender}</li>
                                        <li><strong>Location Shed:</strong> {animalData.locationShed}</li>
                                    </ul>
                                </div>
                                <div className="mating-record-actions">
                                    {/* Add edit and delete icons */}
                                    <FaEdit onClick={() => editAnimal(animalData._id)} className="edit-icon" title="Edit" />
                                    <FaTrashAlt onClick={() => handleClick(animalData._id)} className="delete-icon" title="Delete" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>No animal data available</div>
                )}
            </div>
            
            <ViewAnimalMating animalId={id}/>
            <ViewAnimalWeight animalId={id}/>
            <ViewAnimalBreed animalId={id} />
            <ViewAnimalVaccine animalId={id} />
        </div>
    );
}
