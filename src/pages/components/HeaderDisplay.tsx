"use client";

import styles from "../../styles/central.module.css";
import ActionMenu from "./ActionMenu";

const HeaderDisplay = () => {
  return (
    <div className={styles.headerContainerGlobal}>
      <div className={styles.headerTitleGlobal}>Script Generator</div>

      <div className={styles.headerRightFlexAlign}>
        <div className={styles.updatedTimeGlobal}>
          Updated today at 9:14 AM
        </div>

        {/* <div className={styles.refreshBtnContainerGlobal}>
          <div className={styles.refreshBtnHeaderGlobal}></div>
        </div> */}

        {/* <div
          className={`${styles.draftBtnContainerGlobal} ${styles.marginLeft8}`}
        >
          <div className={styles.draftBtnHeaderGlobal}></div>
          <span className={styles.draftTitleHeaderGlobal}>
            Clear Space
          </span>
        </div> */}

        {/* <div className={styles.reviewPublishContainerGlobal}>
          History
        </div> */}
        {/* <div><ActionMenu /></div> */}
      </div>
    </div>
  );
};

export default HeaderDisplay;
