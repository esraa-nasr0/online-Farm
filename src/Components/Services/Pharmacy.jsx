import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";

function Pharmacy() {
    const { t } = useTranslation();
    
  return (
    <div className="section">
      <h2>{t("Pharmacy")}</h2>
      <div className="content">
        <div className="card2">
          <Link className="Link" to="/treatmentTable">
            <div className="icon">
              <GoTable />
            </div>
            <div className="info">
              <h3>{t("show_data")}</h3>
              <p>{t("all_Pharmacy_details")}</p>
              <button
                className="btn mb-2 me-2 "
                style={{ backgroundColor: "#21763e", color: "white" }}
              >
                {t("go_to_Pharmacy_data")}
              </button>
            </div>
          </Link>
        </div>
        <div className="card2">
          <Link className="Link" to="/treatment">
            <div className="icon">
              <IoAddCircleOutline />
            </div>
            <div className="info">
              <h3>{t("add_Pharmacyt")}</h3>
              <p>{t("add_Pharmacy_details")}</p>
              <button
                className="btn mb-2 me-2 "
                style={{ backgroundColor: "#21763e", color: "white" }}
              >
                {t("go_to_add_Pharmacy")}
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Pharmacy;
