import { Collapse } from "antd";
import styles from "../../styles/central.module.css";

const { Panel } = Collapse;

export const ScriptGeneratorPreview = () => {
  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="end"
    >
      <Panel header="Airflow Script Generator" key="1">
        <div className={styles.manageColorCode}>
          <p style={{ marginTop: "12px", color: "#555" }}>
            Generating Apache Airflow DAG scripts...
          </p>

          <pre
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              fontSize: "14px",
              overflowX: "auto",
            }}
          >
{`# airflow_dag.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def generate_script():
    print("Generating Airflow DAG...")

with DAG(
    dag_id="example_script_generator",
    start_date=datetime(2024, 1, 1),
    schedule_interval="@daily",
    catchup=False
) as dag:

    generate = PythonOperator(
        task_id="generate_script",
        python_callable=generate_script
    )
`}
          </pre>
        </div>
      </Panel>
    </Collapse>
  );
};
