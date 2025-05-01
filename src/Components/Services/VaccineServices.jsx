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

                {/* عرض بيانات اللقاحات */}
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

                {/* إضافة حسب الحيوان */}
                <div className="card2">
                    <Link className='Link' to='/Vaccinebyanimalsstable'>
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

                {/* إضافة حسب موقع الحظيرة */}
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