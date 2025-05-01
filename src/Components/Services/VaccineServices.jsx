import React from 'react';
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function VaccineServices() {
    const { t } = useTranslation();

    return (
        <div className='section'>
            <h2>{t("Vaccine Services")}</h2>
            <div className="content">

                <div className="card2">
                    <Link className='Link' to="/vaccineTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t("Show Data")}</h3>
                            <p>{t("All the Details of Vaccine")}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t("Go to Vaccine Data")}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/vaccinebytagid'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t("Add by Animal")}</h3>
                            <p>{t("Add Details by Animal")}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t("Go to Add Vaccine by Animal")}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to="/vaccinebylocationshed">
                        <div className="icon">
                            <MdOutlineAddToPhotos />
                        </div>
                        <div className="info">
                            <h3>{t("Add by Location Shed")}</h3>
                            <p>{t("Add Details by Location Shed")}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t("Go to Add by Location Shed")}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to="/Vaccinebyanimalsstable">
                        <div className="icon">
                            <MdOutlineAddToPhotos />
                        </div>
                        <div className="info">
                            <h3>{t("Show Data")}</h3>
                            <p>{t("All the Details of Vaccine by tag id and locationshed")}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t("Go to Add by Location Shed")}
                            </button>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default VaccineServices;
