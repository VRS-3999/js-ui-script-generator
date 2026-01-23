"use client";

import styles from "../../styles/central.module.css";
import HeaderDisplay from "../components/HeaderDisplay";
import {ScriptGeneratorPreview} from "../components/scriptGeneratorPreview";
import { Layout } from "antd";
import { DagForm } from "./dagForm";

const { Header } = Layout;

export default function Home() {
  return (
    <>
      <div>
        <Header className={styles.Header}>
          <HeaderDisplay />
        </Header>
        <ScriptGeneratorPreview />
        <DagForm />
      </div>
    </>
  );
}
