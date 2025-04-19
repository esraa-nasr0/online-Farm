import React, { useContext, useEffect, useState } from 'react';
import { GetAnimalContext } from '../../Context/GetAnimalContext';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { useTranslation } from 'react-i18next';
import { TreatmentContext } from '../../Context/TreatmentContext';


function ordinalSuffix(i) {
   
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
}

function ViewAnimalTreatment({ animalId }) {
    const { t } = useTranslation();
    const { deleteTreatment } = useContext(TreatmentContext);
    const navigate = useNavigate();
    const { getAnimalTreatment } = useContext(GetAnimalContext);
    const [treatments, setTreatments] = useState([]);

    useEffect(() => {
        async function fetchTreatmentData() {
            try {
                const { data } = await getAnimalTreatment(animalId);
                setTreatments(data.data.treatments || []);
                console.log('Treatments:', data.data.treatments);
            } catch (error) {
                console.error("Error fetching treatments", error);
            }
        }

        if (animalId) fetchTreatmentData();
    }, [animalId]);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };


    const editVaccine = (id) => {
        navigate(`/editTreatAnimal/${id}`);
    };



        const deleteItem = async (id) => {
            try {
                await deleteTreatment(id);
                setTreatments((prev) => prev.filter((v) => v._id !== id));
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
    return (
        <div className="mating-record-wrapper">
            <div className="mating-record-header">
                <h2>{t('treatment_record')}</h2>
                <button onClick={() => navigate('/add-treatment')} className="add-record-btn">
                    <FaPlusCircle /> {t('add_new_record')}
                </button>
            </div>

            <div className="mating-record-list">
                {treatments.length > 0 ? (
                    treatments.map((treatment, index) => (
                        <div key={treatment._id} className="mating-record-item">
                            <div className="mating-record-info">
                                <span>{ordinalSuffix(index + 1)} {t('treatment')}</span>
                                <ul>
                                    <li><strong>{t('date')}:</strong> {formatDate(treatment.date)}</li>
                                    <li><strong>{t('location')}:</strong> {treatment.location?.name || '-'}</li>
                                    <li><strong>{t('medications')}:</strong>
                                        <ul>
                                            {treatment.medications.map((med) => (
                                                <li key={med._id}>
                                                    {med.name} - {med.dosage}mg - ${med.unitPrice} x {med.dosage} = ${med.totalCost}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className="mating-record-actions">
     <FaEdit
                                    onClick={() => editVaccine(treatment._id)}
                                    className="edit-icon"
                                    title="Edit"
                                />                                   <FaTrashAlt
                                                                    onClick={() => handleClick(treatment._id)}
                                                                    className="delete-icon"
                                                                    title="Delete"
                                                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{t('no_treatment_records')}</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnimalTreatment;
