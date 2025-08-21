import { TbReportAnalytics } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BiSolidReport } from "react-icons/bi";


function ReportServices() {
  const { t } = useTranslation();

  return (
    <div className="section container">
      <h2>{t("report_services")}</h2>
      <div className="content">
        <div className="card2">
          <Link className="Link" to="/report">
            <div className="icon">
              <TbReportAnalytics />
            </div>
            <div className="info">
              <h3>{t("report")}</h3>
              <p>{t("enter_report_data")}</p>
              <button
                className="btn mb-2 me-2"
                style={{ backgroundColor: "#21763e", color: "white" }}
              >
              {t('go_to_report')}
              </button>
            </div>
          </Link>
        </div>
{/* 
        <div className="card2">
          <Link className="Link" to="/reportDaliy">
            <div className="icon">
                <BiSolidReport />
            </div>
            <div className="info">
              <h3>{t('daily_report')}</h3>
            <p>{t('enter_daily_report_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_daily_report')}
            </button>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default ReportServices;
