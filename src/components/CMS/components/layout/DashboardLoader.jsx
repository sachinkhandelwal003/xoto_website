import React from "react";
import styles from "./DashboardLoader.module.css";
import logoNew from "@/assets/img/logoNew.png";

const DashboardLoader = () => {
  return (
    <div className={styles.dashboardLoaderContainer}>
      <div className={styles.dashboardLoaderWrapper}>
        {/* Rotating border spinner */}
        <div className={styles.dashboardRotatingBorder}></div>

        {/* Pulsing Xoto logo centered */}
        <img
          src={logoNew?.src || logoNew}
          alt="Xoto logo"
          className={styles.dashboardLogoSpinner} 
        />
      </div>

      <div className={styles.dashboardLoaderText}>Loading Dashboard...</div>
    </div>
  );
};

export default DashboardLoader;
