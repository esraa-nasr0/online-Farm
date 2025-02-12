import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from "../../Context/GetAnimalContext";
import { useNavigate } from 'react-router-dom';
import { BreedingContext } from '../../Context/BreedingContext'; // Updated import
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

export default function ViewAnimalBreed({animalId}) {
    let navigate = useNavigate();
    const [animalBreed, setAnimalBreed] = useState([]);
    let { getAnimalBreeding } = useContext(GetAnimalContext);
    let { deleteBreeding } = useContext(BreedingContext); // Updated to use BreedingContext

    async function getBreedingforanimal(animalId) {
        let { data } = await getAnimalBreeding(animalId);
        console.log(data.data.breeding);
        setAnimalBreed(data.data.breeding); 
    }

    useEffect(() => {
        if (animalId) {
            getBreedingforanimal(animalId);
        }
    }, [animalId]);

    function BreedingAnimal() {
        navigate("/breeding");
    }

    const deleteItem = async (id) => {
        try {
            const response = await deleteBreeding(id);
            if (response.data.status === "success") {
                Swal.fire("Success", "Record deleted successfully.", "success");
                setAnimalBreed((prev) => prev.filter((breeding) => breeding._id !== id));
            } else {
                Swal.fire("Error", "Could not delete the record.", "error");
                console.error("Error deleting item:", response);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            Swal.fire("Error", "An unexpected error occurred.", "error");
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
            if (result.isConfirmed) {
                deleteItem(id);
            }
        });
    };

    function editBreed(id) {
        navigate(`/editbreading/${id}`);
    }

    return (
        <div>
            <div className="mating-record-wrapper">
                <div className="mating-record-header">
                    <h2>Breed RECORD</h2>
                    <button onClick={BreedingAnimal} className="add-record-btn">
                        <FaPlusCircle /> Add New Record
                    </button>
                </div>

                <div className="mating-record-list">
                    {animalBreed.length > 0 ? (
                        animalBreed.map((Breed, index) => (
                            <div key={Breed._id} className="mating-record-item">
                                <div className="mating-record-info">
                                    <span>{ordinalSuffix(index + 1)} Breed</span>
                                    <ul>
                                        {Breed.birthEntries.map((log) => (
                                            <li key={log._id}>
                                                <strong>Birth weight:</strong> {log.birthweight}<br />
                                                <strong>Gender:</strong> {log.gender}<br />
                                                <strong>Tag Id:</strong> {log.tagId}<br />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mating-record-actions">
                                    <FaEdit onClick={() => editBreed(Breed._id)} className="edit-icon" title="Edit" />
                                    <FaTrashAlt onClick={() => handleClick(Breed._id)} className="delete-icon" title="Delete" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No mating records found for this animal.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
