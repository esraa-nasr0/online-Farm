import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BreedingServices() {
    const { t } = useTranslation();

    return (
        <div className='section'>
            <h2>{t('breeding_services')}</h2>
            <div className="content">
                <div className="card2">
                    <Link className='Link' to="/breadingTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('breeding')}</h3>
                            <p>{t('enter_breeding_data')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_breeding')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/breeding'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_breeding')}</h3>
                            <p>{t('enter_breeding_data')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_add_breeding')}
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BreedingServices;
