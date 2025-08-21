import React from 'react';
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CiViewTable } from "react-icons/ci";


function WeightServices() {
    const { t } = useTranslation();

    return (
    <div className='section container'>
        <h2>{t('weight_services')}</h2>
        <div className="content">
        <div className="card2">
            <Link className='Link' to="/weightTable">
            <div className="icon">
                <GoTable />
            </div>
            <div className="info">
                <h3>{t('show_data')}</h3>
                <p>{t('weight_details')}</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                {t('go_to_weight_data')}
                </button>
            </div>
            </Link>
        </div>

        <div className="card2">
            <Link className='Link' to='/weight'>
            <div className="icon">
                <IoAddCircleOutline />
            </div>
            <div className="info">
                <h3>{t('add_weight')}</h3>
                <p>{t('add_weight_details')}</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                {t('go_to_add_weight')}
                </button>
            </div>
            </Link>
        </div>
        
                        <div className="card2">
                            <Link className='Link'  to='/withGrowthData' >
                                <div className="icon">
                                <CiViewTable />
                                </div>
                                <div className="info">
                                <h3>{t('Animal Growth')}</h3>
                                <p>{t('show Animal Growth')}</p>
                                    <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                        {t('show Animal Growth data')}
                                    </button>
                                </div>
                            </Link>
                        </div>
        </div>
    </div>
    );
}

export default WeightServices;
