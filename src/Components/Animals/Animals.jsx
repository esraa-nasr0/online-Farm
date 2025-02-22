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

export default function Animals() {
    const navigate = useNavigate();
    const { removeAnimals, getAnimals } = useContext(AnimalContext);

    const [animals, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
    const [animalsPerPage] = useState(10); // عدد العناصر في كل صفحة
    const [totalPages, setTotalPages] = useState(1); // إجمالي عدد الصفحات

    const [searchTagId, setSearchTagId] = useState('');
    const [searchAnimalType, setSearchAnimalType] = useState('');
    const [searchLocationShed, setSearchLocationShed] = useState('');
    const [searchBreed, setSearchBreed] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const [pagination, setPagination] = useState({ totalPages: 1 }); // حالة جديدة لتخزين معلومات الصفحات

    // حذف عنصر
    const removeItem = async (id) => {
        try {
            await removeAnimals(id);
            setAnimals(prevAnimals => prevAnimals.filter(animal => animal._id !== id));
            Swal.fire('Deleted!', 'Animal has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete Animal:', error);
            Swal.fire('Error', 'Failed to delete Animal.', 'error');
        }
    };

    // جلب البيانات من الـ API
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
          
            setPagination(data.pagination); // تحديث حالة الصفحات
            const total = data.pagination.totalPages;
            setTotalPages(total); // تحديث عدد الصفحات
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // جلب البيانات عند تغيير الصفحة أو عوامل البحث
    useEffect(() => {
        fetchAnimals();
    }, [ currentPage]);

    // تأكيد الحذف
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
                removeItem(id);
            }
        });
    };

    // تحرير عنصر
    const editAnimal = (id) => {
        navigate(`/editAnimal/${id}`);
    };

    // عرض تفاصيل العنصر
    const viewAnimal = (id) => {
        navigate(`/viewDetailsofAnimal/${id}`);
    };

    // البحث
    const handleSearch = () => {
        setCurrentPage(1); // العودة إلى الصفحة الأولى عند البحث
        fetchAnimals();
    };

    // تغيير الصفحة
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // عرض أزرار الصفحات
    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages; // استخدام القيمة من حالة الصفحات
        for (let i = 1; i <= total; i++) { // استخدام `total` بدلاً من `totalPages`
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
                    <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">Animals</div>
                    <div className="flex-column flex-md-row mb-3">
                        <Link to='/AnimalsDetails'>
                            <button type="button" className="btn btn-lg btn-secondary active button2">
                                <MdOutlineAddToPhotos /> Add New Animal
                            </button>
                        </Link>
                    </div>

                    <div className='container mt-5'>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input type="text" className="form-control" placeholder="Search by Tag ID" value={searchTagId} onChange={(e) => setSearchTagId(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder="Search by Animal Type" value={searchAnimalType} onChange={(e) => setSearchAnimalType(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder="Search by Location Shed" value={searchLocationShed} onChange={(e) => setSearchLocationShed(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder="Search by Breed" value={searchBreed} onChange={(e) => setSearchBreed(e.target.value)} style={{ flex: 1 }} />
                            <input type="text" className="form-control" placeholder="Search by Gender" value={searchGender} onChange={(e) => setSearchGender(e.target.value)} style={{ flex: 1 }} />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#88522e', borderColor: '#88522e', color: 'white' }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <table className="table table-hover mt-3 p-2">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tag ID</th>
                                <th scope="col">Animal Type</th>
                                <th scope="col">Breed</th>
                                <th scope="col">Gender</th>
                                <th scope="col">View Details</th>
                                <th scope="col">Edit Animal</th>
                                <th scope="col">Remove Animal</th>
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
                                        <GrView /> View Details
                                    </td>
                                    <td onClick={() => editAnimal(animal._id)} style={{ cursor: 'pointer' }} className='text-success'>
                                        <FaRegEdit /> Edit Animal
                                    </td>
                                    <td onClick={() => handleClick(animal.id || animal._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                        <RiDeleteBin6Line /> Remove Animal
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* أزرار الصفحات */}
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