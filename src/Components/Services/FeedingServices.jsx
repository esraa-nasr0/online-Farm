import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { CiViewTable } from "react-icons/ci";
import { MdNoteAdd } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function FeedingServices() {
    const { t } = useTranslation();

    return (
        <div className='section'>
            <h2>{t('feeding_services')}</h2>
            <div className="content">

                <div className="card2">
                    <Link className='Link' to="/feedingTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('show_data')}</h3>
                            <p>{t('feeding_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_feeding_data')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/feed'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_by_feeding')}</h3>
                            <p>{t('add_details_by_feeding')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_add_feeding')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/feedlocationtable'>
                        <div className="icon">
                            <CiViewTable />
                        </div>
                        <div className="info">
                            <h3>{t('show_data')}</h3>
                            <p>{t('feeding_details_by_location')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_data_by_location')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/feedbylocation'>
                        <div className="icon">
                            <MdNoteAdd />
                        </div>
                        <div className="info">
                            <h3>{t('add_by_location')}</h3>
                            <p>{t('add_details_by_location')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>
                                {t('go_to_add_by_location')}
                            </button>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default FeedingServices;
