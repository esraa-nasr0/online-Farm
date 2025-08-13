import React from 'react'

import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdNoteAdd, MdOutlineAddToPhotos } from "react-icons/md";


function SupplierServices() {
    const { t } = useTranslation();
    
  return (
 <div className='section'>
            <h2>{t('Supplier_services')}</h2>
            <div className="content">
                <div className="card2">
                    <Link className='Link' to="/supplierTable">
                        <div className="icon">
                            <GoTable />
                        </div>
                        <div className="info">
                            <h3>{t('Supplier')}</h3>
                            <p>{t('show_Supplier_data')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_Supplier')}
                            </button>
                        </div>
                    </Link>
                </div>

                <div className="card2">
                    <Link className='Link' to="/supplier">
                        <div className="icon">
                            <IoAddCircleOutline />
                        </div>
                        <div className="info">
                            <h3>{t('add_new_Supplier')}</h3>
                            <p>{t('enter_Supplier_data')}</p>
                            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                                {t('go_to_add_Supplier')}
                            </button>
                        </div>
                    </Link>
                </div>
                <div className="card2">
                        <Link className='Link' to="/linkSupplierTreatment">
                        <div className="icon">
                        <MdOutlineAddToPhotos />
                        </div>
                        <div className="info">
                            <h3>{t("add_by_Supplier_Treatment")}</h3>
                            <p>{t("add_details_by_Supplier_Treatment")}</p>
                            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#21763e', color: 'white' }}>{t("go_to_add_by_Supplier_Treatment")}</button>
                        </div>
                        </Link>
                    </div>
                    <div className="card2">
                            <Link className='Link' to='/linkSupplierFeed'>
                            <div className="icon">
                            <MdNoteAdd />
                            </div>
                            <div className="info">
                                <h3>{t("add_by_Supplier_Feed")}</h3>
                                <p>{t("add_details_Supplier_Feed")}</p>
                                <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#21763e', color: 'white' }}>{t("go_to_add_Supplier_Feed")}</button>
                            </div>
                            </Link>
                            </div>
            </div>
        </div>  )
}

export default SupplierServices