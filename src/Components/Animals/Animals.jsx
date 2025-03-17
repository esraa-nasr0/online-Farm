import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Rings } from 'react-loader-spinner';
import { AnimalContext } from '../../Context/AnimalContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { useTranslation } from 'react-i18next';

export default function Animals() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { removeAnimals, getAnimals } = useContext(AnimalContext);

    const [animals, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [animalsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTagId, setSearchTagId] = useState('');
    const [searchAnimalType, setSearchAnimalType] = useState('');
    const [searchLocationShed, setSearchLocationShed] = useState('');
    const [searchBreed, setSearchBreed] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const removeItem = async (id) => {
        try {
            await removeAnimals(id);
            setAnimals(prevAnimals => prevAnimals.filter(animal => animal._id !== id));
            Swal.fire(t('deleted'), t('animal_deleted'), 'success');
        } catch (error) {
            Swal.fire(t('error'), t('failed_to_delete_animal'), 'error');
        }
    };

    const fetchAnimals = async () => {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchTagId,
                animalType: searchAnimalType,
                breed: searchBreed,
                locationShed: searchLocationShed,
                gender: searchGender,
            };

            const { data } = await getAnimals(currentPage, animalsPerPage, filters);
            setAnimals(data.data.animals);
            setPagination(data.pagination);
            const total = data.pagination.totalPages;
            setTotalPages(total);
        } catch (error) {
            Swal.fire(t('error'), t('failed_to_fetch_data'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, [currentPage]);

    const handleClick = (id) => {
        Swal.fire({
            title: t('are_you_sure'),
            text: t('you_wont_be_able_to_revert_this'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('yes_delete_it'),
        }).then((result) => {
            if (result.isConfirmed) {
                removeItem(id);
            }
        });
    };

    const editAnimal = (id) => {
        navigate(`/editAnimal/${id}`);
    };

    const viewAnimal = (id) => {
        navigate(`/viewDetailsofAnimal/${id}`);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchAnimals();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages;
        for (let i = 1; i <= total; i++) {
            buttons.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        return buttons;
    };

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">{t('animals')}</div>

                    <div className='container mt-5'>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input type="text" className="form-control" placeholder={t('search_by_tag_id')} value={searchTagId} onChange={(e) => setSearchTagId(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder={t('search_by_animal_type')} value={searchAnimalType} onChange={(e) => setSearchAnimalType(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder={t('search_by_location_shed')} value={searchLocationShed} onChange={(e) => setSearchLocationShed(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder={t('search_by_breed')} value={searchBreed} onChange={(e) => setSearchBreed(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder={t('search_by_gender')} value={searchGender} onChange={(e) => setSearchGender(e.target.value)} style={{ flex: 1 }} />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                    <div className="full-width-table">
                    <table className="table table-hover mt-3 p-2">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{t('tag_id')}</th>
                                <th scope="col">{t('animal_type')}</th>
                                <th scope="col">{t('breed')}</th>
                                <th scope="col">{t('gender')}</th>
                                <th scope="col">{t('view_details')}</th>
                                <th scope="col">{t('edit_animal')}</th>
                                <th scope="col">{t('remove_animal')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animals.map((animal, index) => (
                                <tr key={`${animal.id || animal._id}-${index}`}>
                                    <th scope="row">{(currentPage - 1) * animalsPerPage + index + 1}</th>
                                    <td>{animal.tagId}</td>
                                    <td>{animal.animalType}</td>
                                    <td>{animal.breed}</td>
                                    <td>{animal.gender}</td>
                                    <td onClick={() => viewAnimal(animal._id)} style={{ cursor: 'pointer' }} className='text-primary'>
                                        <GrView /> {t('view_details')}
                                    </td>
                                    <td onClick={() => editAnimal(animal._id)} style={{ cursor: 'pointer' }} className='text-success'>
                                        <FaRegEdit /> {t('edit_animal')}
                                    </td>
                                    <td onClick={() => handleClick(animal.id || animal._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                        <RiDeleteBin6Line /> {t('remove_animal')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                    </div>
                    </div>
                    
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {renderPaginationButtons()}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
