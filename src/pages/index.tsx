"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import SideBar from "./components/SideBar";
import ScriptGenerator from "./components/ScriptGenerator";
import styles from "@/styles/central.module.css";

const { Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Layout className={styles.LayoutBoard}>
        <Content
          style={{
            padding: 20,
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <ScriptGenerator />
        </Content>
      </Layout>
    </Layout>
  );
}
