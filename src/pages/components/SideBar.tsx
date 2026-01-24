"use client";

import React from "react";
import { Layout, Menu } from "antd";
import styles from "../../styles/central.module.css";
import Image from "next/image";

import CompanyLogo from "../../assets/campaign-logo.png";

const { Sider } = Layout;

interface SideBarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    {
      key: "company",
      label: (
        <div className={styles.companyMenuItem}>
          <Image
            src={CompanyLogo}
            alt="Generator"
            className={styles.CompanyLogo}
            width={24}
            height={24}
          />
          {!collapsed && <span>Script Generator</span>}
        </div>
      ),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={200}
      className={styles.sideBar}
      onClick={toggleSidebar}
    >
      <Menu
        theme="light"
        mode="inline"
        className={styles.SideBarMenu}
        items={menuItems}
      />
    </Sider>
  );
};

export default SideBar;
