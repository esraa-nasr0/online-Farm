import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from '../../Context/GetAnimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MatingContext } from '../../Context/MatingContext';
import Swal from 'sweetalert2';

function ordinalSuffix(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}

function ViewAnimalMating({ animalId }) {
    let navigate = useNavigate();
    let { getAnimalMating } = useContext(GetAnimalContext);
    let { deleteMating } = useContext(MatingContext);
    const [animalMating, setAnimalMating] = useState([]);

    async function getMating(animalId) {
        const { data } = await getAnimalMating(animalId);
        setAnimalMating(data.data.mating);
    }

    useEffect(() => {
        if (animalId) {
            getMating(animalId);
        }
    }, [animalId]);

    
        const deleteItem = async (id) => {
            try {
                await deleteMating(id);
                setAnimalMating((prevMatings) => prevMatings.filter((mating) => mating._id !== id));
                Swal.fire('Deleted!', 'Mating has been deleted.', 'success');
            } catch (error) {
            console.error('Failed to delete Mating:', error);
            Swal.fire('Error', 'Failed to delete Mating.', 'error');
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
    

    function editMating(id) {
        navigate(`/editMating/${id}`);
    }

    function MatingAnimal() {
        navigate(`/mating`);
    }

    // Helper function to format date
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <div className="mating-record-wrapper">
            <div className="mating-record-header">
                <h2>MATING RECORD</h2>
                <button onClick={() => MatingAnimal()} className="add-record-btn">
                    <FaPlusCircle /> Add New Record
                </button>
            </div>

            <div className="mating-record-list">
                {animalMating.length > 0 ? (
                    animalMating.map((mating, index) => (
                        <div key={mating._id} className="mating-record-item">
                            <div className="mating-record-info">
                                <span>{ordinalSuffix(index + 1)} Mating</span>
                                <ul>
                                    <li><strong>Mating Type:</strong> {mating.matingType}</li>
                                    <li><strong>Mating Date:</strong> {formatDate(mating.matingDate)}</li>
                                    <li><strong>Sonar Date:</strong> {formatDate(mating.sonarDate)}</li>
                                    <li><strong>Sonar Result:</strong> {mating.sonarRsult}</li>
                                    <li><strong>Expected Delivery Date:</strong> {formatDate(mating.expectedDeliveryDate)}</li>
                                </ul>
                            </div>
                            <div className="mating-record-actions">
                                <FaEdit onClick={() => editMating(mating._id)} className="edit-icon" title="Edit" />
                                <FaTrashAlt onClick={() => handleClick(mating._id)} className="delete-icon" title="Delete" />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No mating records found for this animal.</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnimalMating;
