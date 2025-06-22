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
            <h2>{t('title')}</h2>
            <div className="content">

  
                <div className="card2">
                    <Link className='Link' to="/vaccineTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('showTitle')}</h3>
                            <p>{t('showDescription')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('showButton')}
                            </button>
                        </div>
                    </Link>
                </div>


                <div className="card2">
                    <Link className='Link' to='/Vaccinebyanimalsstable' >
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('Add New Vaccine')}</h3>
                            <p>{t('showDescription-v')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('showButton')}
                            </button>
                        </div>
                    </Link>
                </div>
                <div className="card2">
                    <Link className='Link' to="/addVaccine">
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                        <h3>{t('showTitle')}</h3>
                        <p>{t('showDescription2')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('addByAnimalButton')}
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
                            <h3>{t('addByAnimalTitle')}</h3>
                            <p>{t('addByAnimalDescription')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('addByAnimalButton')}
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
                            <h3>{t('addByLocationTitle')}</h3>
                            <p>{t('addByLocationDescription')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('addByLocationButton')}
                            </button>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default VaccineServices;