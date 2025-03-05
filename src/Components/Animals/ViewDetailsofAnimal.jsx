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
import { useTranslation } from 'react-i18next';

export default function ViewDetailsofAnimal() {
    const { t } = useTranslation();
    const { id } = useParams();  
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [animalData, setAnimalData] = useState(null);
    const navigate = useNavigate();
    const { removeAnimals } = useContext(AnimalContext);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitAnimals() {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            let { data } = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/animal/getsinglanimals/${id}`,
                { headers }
            );
            if (data.status === 'success') {
                setIsLoading(false);
                setAnimalData(data.data.animal);
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message);
        }
    }

    useEffect(() => {
        if (id) {
            submitAnimals();
        }
    }, []);

    const removeItem = async (id) => {
        await removeAnimals(id);
        navigate('/animals');
    };

    const handleClick = (id) => {
        Swal.fire({
            title: t("are_you_sure"),
            icon: "question",
            confirmButtonText: t("yes_delete_it"),
            cancelButtonText: t("cancel"),
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

    const addNewAnimal = () => {
        navigate('/animalsDetails');
    };

    return (
        <div className="container">
            <div className="title2">{t("view_details")}</div>
            <div className='mating-record-wrapper'>
                <div className="mating-record-header">
                    <h2>{t("animals")}</h2>
                    <button onClick={addNewAnimal} className="add-record-btn">
                        <FaPlusCircle /> {t("add_new_animal")}
                    </button>
                </div>

                {isLoading ? (
                    <div>{t("loading")}</div>
                ) : error ? (
                    <div>{t("error_message")}</div>
                ) : animalData ? (
                    <div className="animal-details">
                        <div className="mating-record-list">
                            <div className="mating-record-item">
                                <div className="mating-record-info">
                                    <ul>
                                        <li><strong>{t("tag_id")}:</strong> {animalData.tagId}</li>
                                        <li><strong>{t("animal_type")}:</strong> {t(animalData.animalType)}</li>
                                        <li><strong>{t("breed")}:</strong> {animalData.breed}</li>
                                        <li><strong>{t("gender")}:</strong> {t(animalData.gender)}</li>
                                        <li><strong>{t("location_shed")}:</strong> {animalData.locationShed}</li>
                                    </ul>
                                </div>
                                <div className="mating-record-actions">
                                    <FaEdit onClick={() => editAnimal(animalData._id)} className="edit-icon" title={t("edit")} />
                                    <FaTrashAlt onClick={() => handleClick(animalData._id)} className="delete-icon" title={t("delete")} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>{t("error_message")}</div>
                )}
            </div>
            
            <ViewAnimalMating animalId={id}/>
            <ViewAnimalWeight animalId={id}/>
            <ViewAnimalBreed animalId={id} />
            <ViewAnimalVaccine animalId={id} />
        </div>
    );
}
