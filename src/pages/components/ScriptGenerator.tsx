"use client";

import styles from "../../styles/central.module.css";
import HeaderDisplay from "../components/HeaderDisplay";
import {ScriptGeneratorPreview} from "../components/scriptGeneratorPreview";
import { Layout } from "antd";
import { useState } from "react";
import { DagForm } from "./dagForm";

const { Header } = Layout;

export default function Home() {
  const [dagCode, setDagCode] = useState<string | null>(null);
  return (
    <>
      <div>
        <Header className={styles.Header}>
          <HeaderDisplay />
        </Header>
        <ScriptGeneratorPreview dagCode={dagCode}/>
        <DagForm setDagCode={setDagCode}/>
      </div>
    </>
  );
}
