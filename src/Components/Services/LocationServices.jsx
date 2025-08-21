import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function LocationServices() {
    const { t } = useTranslation();

    return (
        <div className='section container'>
            <h2>{t('location_services')}</h2>
            <div className="content">
                <div className="card2">
                    <Link className='Link' to="/locationTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('show_data')}</h3>
                            <p>{t('location_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_location_data')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/locationPost'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_location')}</h3>
                            <p>{t('add_location_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_add_location')}
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LocationServices;
