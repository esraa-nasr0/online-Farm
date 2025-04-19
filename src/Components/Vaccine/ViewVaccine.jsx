import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from '../../Context/GetAnimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Vaccinetableentriescontext } from '../../Context/Vaccinetableentriescontext';
import { useTranslation } from 'react-i18next';

function ordinalSuffix(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + 'st';
    if (j === 2 && k !== 12) return i + 'nd';
    if (j === 3 && k !== 13) return i + 'rd';
    return i + 'th';
}

function ViewAnimalVaccine({ animalId }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getAnimalVaccine } = useContext(GetAnimalContext);
    const { DeletVaccineanimal } = useContext(Vaccinetableentriescontext);
    const [animalVaccine, setAnimalVaccine] = useState([]);

    async function getVaccine(id) {
        try {
            const response = await getAnimalVaccine(id);
            if (response && response.data) {
                setAnimalVaccine(response.data.vaccines);
                // console.log('Fetched vaccine data:', response.data.vaccines);
            } else {
                setAnimalVaccine([]);
                console.warn('No vaccine data found');
            }
        } catch (error) {
            console.error('Failed to fetch vaccine data:', error);
            setAnimalVaccine([]);
        }
    }

    useEffect(() => {
        if (animalId) {
            console.log('Animal ID:', animalId);
            getVaccine(animalId);
        }
    }, [animalId]);

    const deleteItem = async (id) => {
        try {
            await DeletVaccineanimal(id);
            setAnimalVaccine((prev) => prev.filter((v) => v._id !== id));
            Swal.fire(t('deleted'), t('Vaccine_deleted_success'), 'success');
        } catch (error) {
            console.error(t('delete_failed_weigh'), error);
            Swal.fire(t('error'), t('Vaccine_deleted_failed'), 'error');
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

    const editVaccine = (id) => {
        navigate(`/editVaccineanimals/${id}`);
    };

    const addNewVaccine = () => {
        navigate(`/Vaccinebyanimalsstable`);
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="mating-record-wrapper">
            <div className="mating-record-header">
                <h2>{t('Vaccine_record')}</h2>
                <button onClick={addNewVaccine} className="add-record-btn">
                    <FaPlusCircle /> {t('add_new_record')}
                </button>
            </div>

            <div className="mating-record-list">
                {animalVaccine.length > 0 ? (
                    animalVaccine.map((vaccine, index) => (
                        <div key={vaccine._id} className="mating-record-item">
                            <div className="mating-record-info">
                                <span>
                                    {ordinalSuffix(index + 1)} {t('Vaccine')}
                                </span>
                                <ul>
                                    <li>
                                        <strong>{t('date')}:</strong> {formatDate(vaccine.Date)}
                                    </li>
                                    <li>
                                        <strong>{t('Vaccine')}:</strong> {vaccine.entryType}
                                    </li>
                                    

                                    <li>
<strong>{t('Location')}:</strong> {vaccine.locationShed?.name || t('Not_available')}
                                    </li>
                                    <li>
                                    <strong>{t('Vaccine_Name')}:</strong> {vaccine.vaccine?.name || t('Not_available')}

                                    </li>

                                </ul>
                            </div>
                            <div className="mating-record-actions">
                                <FaEdit
                                    onClick={() => editVaccine(vaccine._id)}
                                    className="edit-icon"
                                    title="Edit"
                                />
                                <FaTrashAlt
                                    onClick={() => handleClick(vaccine._id)}
                                    className="delete-icon"
                                    title="Delete"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{t('no_Vaccine_records')}</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnimalVaccine;
