import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from "../../Context/GetAnimalContext";
import { useNavigate } from 'react-router-dom';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

function ordinalSuffix(i) {    
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}

export default function ViewAnimalVaccine({animalId}) {
    let navigate = useNavigate();
    const [animalVaccine, setAnimalVaccine] = useState([]);
    let { getAnimalVaccine } = useContext(GetAnimalContext);
    let { DeletVaccineanimal } = useContext(VaccineanimalContext);

    
    async function getVaccineforanimal(animalId) {
        let { data } = await getAnimalVaccine(animalId);
        console.log(data);
        setAnimalVaccine(data.vaccine); 
    }

    useEffect(() => {
        if (animalId) {
            getVaccineforanimal(animalId);
        }
    }, [animalId]);


    function MatingAnimal() {
        navigate("/vaccinebyanimal");
    }
    
            const deleteItem = async (id) => {
                try {
                    await DeletVaccineanimal(id);
                    setAnimalVaccine(prevVaccines => prevVaccines.filter(vaccine => vaccine._id !== id));
                    Swal.fire('Deleted!', 'vaccine has been deleted.', 'success');
                } catch (error) {
                console.error('Failed to delete vaccine:', error);
                Swal.fire('Error', 'Failed to delete vaccine.', 'error');
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

    function editVaccine(id) {
        navigate(`/editVaccine/${id}`);
    }

    return (
        <div>
            <div className="mating-record-wrapper">
                <div className="mating-record-header">
                    <h2>Vaccine RECORD</h2>
                    <button onClick={MatingAnimal} className="add-record-btn">
                        <FaPlusCircle /> Add New Record
                    </button>
                </div>

                <div className="mating-record-list">
                    {animalVaccine.length > 0 ? (
                        animalVaccine.map((vaccine, index) => (
                            <div key={vaccine._id} className="mating-record-item">
                                <div className="mating-record-info">
                                    <span>{ordinalSuffix(index + 1)} Vaccine</span>
                                    <ul>
                                        <li><strong>Vaccine Name:</strong> {vaccine.vaccineName}</li>
                                        <li><strong>Given Every:</strong> {vaccine.givenEvery} days</li>
                                        <li><strong>Vaccination Log:</strong></li>
                                        <ul>
                                            {vaccine.vaccinationLog.map((log) => (
                                                <li key={log._id}>
                                                    <strong>Tag ID:</strong> {log.tagId}<br />
                                                    <strong>Date Given:</strong> {new Date(log.DateGiven).toLocaleDateString()}<br />
                                                    <strong>Location Shed:</strong> {log.locationShed}<br />
                                                    <strong>Valid Till:</strong> {new Date(log.vallidTell).toLocaleDateString()}<br />
                                                    <strong>Created At:</strong> {new Date(log.createdAt).toLocaleDateString()}
                                                </li>
                                            ))}
                                        </ul>
                                    </ul>
                                </div>
                                <div className="mating-record-actions">
                                    <FaEdit onClick={() => editVaccine(vaccine._id)} className="edit-icon" title="Edit" />
                                    <FaTrashAlt onClick={() => handleClick(vaccine._id)} className="delete-icon" title="Delete" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Vaccine records found for this animal.</p>
                    )}
                </div>
            </div>
        </div>
    );
}