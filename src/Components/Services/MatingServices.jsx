import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function MatingServices() {
    const { t } = useTranslation();

    return (
        <div className='section'>
            <h2>{t('mating_services')}</h2>
            <div className="content">

                <div className="card2">
                    <Link className='Link' to="/matingTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('show_data')}</h3>
                            <p>{t('mating_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_mating_data')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to='/mating'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_mating')}</h3>
                            <p>{t('add_mating_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_add_mating')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to="/matingLocation">
                        <div className="icon">
                            <MdOutlineAddToPhotos />
                        </div>
                        <div className="info">
                            <h3>{t('add_by_location_shed')}</h3>
                            <p>{t('add_details_by_location_shed')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_add_by_location_shed')}
                            </button>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default MatingServices
