import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from '../../Context/GetAnimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { BreedingContext } from '../../Context/BreedingContext';


function ordinalSuffix(i) {    
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}


function ViewAnimalBreeding({ animalId }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getAnimalBreeding } = useContext(GetAnimalContext);
    const { deleteBreeding } = useContext(BreedingContext);
    const [animalBreeding, setAnimalBreeding] = useState([]);

    async function getBreeding(id) {
        try {
            const response = await getAnimalBreeding(id);
            if (response && response.data) {
                const breedingData = response.data.data.breeding;
                setAnimalBreeding(Array.isArray(breedingData) ? breedingData : []);
                console.log('Fetched breeding data:', breedingData);
            } else {
                setAnimalBreeding([]);
                console.warn('No Breeding data found');
            }
        } catch (error) {
            console.error('Failed to fetch Breeding data:', error);
            setAnimalBreeding([]);
        }
    }

    useEffect(() => {
        if (animalId) {
            console.log('Animal ID:', animalId);
            getBreeding(animalId);
        }
    }, [animalId]);

    const editBreeding = (id) => {
        navigate(`/editbreading/${id}`);
    };

    const addNewBreeding = () => {
        navigate(`/Breeding`);
    };

    const deleteItem = async (id) => {
        try {
            await deleteBreeding(id);
            setAnimalBreeding((prev) => prev.filter((v) => v._id !== id));
            Swal.fire(t('deleted'), t('Breeding_deleted_success'), 'success');
        } catch (error) {
            console.error(t('delete_failed_weigh'), error);
            Swal.fire(t('error'), t('Breeding_deleted_failed'), 'error');
        }
    };

    const handleClick = (id) => {
        Swal.fire({
            title: t('confirm_delete'),
            text: t('delete_warning'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete'),
        }).then((result) => {
            if (result.isConfirmed) deleteItem(id);
        });
    };

    return (
        <div className="mating-record-wrapper">
            <div className="mating-record-header">
                <h2>{t('Breedind records')}</h2>
                <button onClick={addNewBreeding} className="add-record-btn">
                    <FaPlusCircle /> {t('add_new_record')}
                </button>
            </div>

            <div className="mating-record-list">
                {animalBreeding && animalBreeding.length > 0 ? (
                    animalBreeding.map((breeding , index) => (
                        <div className="mating-record-item" key={breeding._id}>
                            <div className="mating-record-info">
                            <span>{ordinalSuffix(index + 1)} Breeding</span>
                                <p><strong>Tag ID:</strong> {breeding.tagId}</p>
                                <p><strong>Delivery Date:</strong> {breeding.deliveryDate?.slice(0, 10)}</p>
                                <p><strong>Delivery State:</strong> {breeding.deliveryState}</p>
                                <p><strong>Number of Births:</strong> {breeding.numberOfBriths}</p>

                                {breeding.birthEntries?.length > 0 && (
                                    <>
                                        <p><strong>Birth Entries:</strong></p>
                                        <ul className="birth-entries-list pl-4 list-disc">
                                            {breeding.birthEntries.map((entry) => (
                                                <li key={entry._id}>
                                                    Tag: {entry.tagId}, Gender: {entry.gender}, Weight: {entry.birthweight} kg
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="mating-record-actions">
                                <FaEdit
                                    onClick={() => editBreeding(breeding._id)}
                                    className="edit-icon"
                                    title="Edit"
                                />
                                <FaTrashAlt
                                    onClick={() => handleClick(breeding._id)}
                                    className="delete-icon"
                                    title="Delete"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{t('no_Breeding_records')}</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnimalBreeding;
