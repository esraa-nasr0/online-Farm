import React from 'react';
import { useTranslation } from 'react-i18next';
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function ExcludedServices() {
    const { t } = useTranslation();

    return (
        <div className='section container'>
            <h2>{t('excluded_services')}</h2>
            <div className="content">
                <div className="card2">
                    <Link className='Link' to="/excludedtable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('show_data')}</h3>
                            <p>{t('all_excluded_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_excluded_data')}
                            </button>
                        </div>
                    </Link>
                </div>
                <div className="card2">
                    <Link className='Link' to='/excluded'>
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_excluded')}</h3>
                            <p>{t('add_excluded_details')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_add_excluded')}
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default ExcludedServices;

