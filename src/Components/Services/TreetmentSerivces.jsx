import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { CiViewTable } from "react-icons/ci";
import { MdNoteAdd } from "react-icons/md";
import { useTranslation } from 'react-i18next';


function TreetmentServices() {
    const { t } = useTranslation();
    

    return (
    <div className='section'>
        <h2>{t("treatment_services")}</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/treatmentTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>{t("show_data")}</h3>
            <p>{t("all_treatment_details")}</p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>{t("go_to_treatment_data")}</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/treatment'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>{t("add_treatment")}</h3>
            <p>{t("add_treatment_details")}</p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>{t("go_to_add_treatment")}</button>
        </div>
        </Link>
        </div>
        <div className="card2">
        <Link className='Link' to='/treatAnimalTable'>
        <div className="icon">
        <CiViewTable />
        </div>
        <div className="info">
            <h3>{t("show_data")}</h3>
            <p>{t("treatment_details_by_animal")}</p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>{t("go_to_data_by_animal")}</button>
        </div>
        </Link>
        </div>
    <div className="card2">
        <Link className='Link' to='/treatmentAnimal'>
        <div className="icon">
        <MdNoteAdd />
        </div>
        <div className="info">
            <h3>{t("add_by_animal")}</h3>
            <p>{t("add_details_by_animal")}</p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>{t("go_to_add_by_animal")}</button>
        </div>
        </Link>
        </div>
        <div className="card2">
        <Link className='Link' to="/treatmentLocation">
        <div className="icon">
        <MdOutlineAddToPhotos />
        </div>
        <div className="info">
            <h3>{t("add_by_location_shed")}</h3>
            <p>{t("add_details_by_location_shed")}</p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>{t("go_to_add_by_location_shed")}</button>
        </div>
        </Link>
    </div>
</div>
    </div>
    )
}

export default TreetmentServices