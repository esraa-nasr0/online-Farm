import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from '../../Context/GetAnimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { WeightContext } from '../../Context/WeightContext';

function ordinalSuffix(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}

function ViewAnimalWeight({ animalId }) {
    let navigate = useNavigate();
    let { getAnimalWeight } = useContext(GetAnimalContext);
    const [animalWeight, setAnimalWeight] = useState([]);
    let { deleteWeight } = useContext(WeightContext);

    async function getWeight(animalId) {
        const { data } = await getAnimalWeight(animalId);
        setAnimalWeight(data.data.weight);
    }

    useEffect(() => {
        if (animalId) {
            getWeight(animalId);
        }
    }, [animalId]);

            const deleteItem = async (id) => {
                try {
                    await deleteWeight(id);
                    setAnimalWeight((prevWeights) => prevWeights.filter((weight) => weight._id !== id));
                    Swal.fire('Deleted!', 'Weight has been deleted.', 'success');
                } catch (error) {
                console.error('Failed to delete Weight:', error);
                Swal.fire('Error', 'Failed to delete Weight.', 'error');
                }
            };
        
            const handleClick = (id) => {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                    if (result.isConfirmed) deleteItem(id);
                });
            };
        

    function editWeight(id) {
        navigate(`/editWeight/${id}`);
    }

    function WeightAnimal() {
        navigate(`/weight`);
    }

    // Helper function to format date
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <div className="mating-record-wrapper">
            <div className="mating-record-header">
                <h2>WEIGHT RECORD</h2>
                <button onClick={() => WeightAnimal()} className="add-record-btn">
                    <FaPlusCircle /> Add New Record
                </button>
            </div>

            <div className="mating-record-list">
                {animalWeight.length > 0 ? (
                    animalWeight.map((weight, index) => (
                        <div key={weight._id} className="mating-record-item">
                            <div className="mating-record-info">
                                <span>{ordinalSuffix(index + 1)} Weight</span>
                                <ul>
                                    <li><strong>Date:</strong> {formatDate(weight.Date)}</li>
                                    <li><strong>Weight:</strong> {weight.weight} kg</li>
                                    <li><strong>Height:</strong> {weight.height} cm</li>
                                    <li><strong>Weight Type:</strong> {weight.weightType}</li>
                                </ul>
                            </div>
                            <div className="mating-record-actions">
                                <FaEdit onClick={() => editWeight(weight._id)} className="edit-icon" title="Edit" />
                                <FaTrashAlt onClick={() => handleClick(weight._id)} className="delete-icon" title="Delete" />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No weight records found for this animal.</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnimalWeight;
