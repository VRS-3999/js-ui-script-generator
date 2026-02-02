import { Collapse, Typography, Divider, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

type ScriptGeneratorPreviewProps = {
  dagCode: string | null;
};

export const ScriptGeneratorPreview: React.FC<ScriptGeneratorPreviewProps> = ({
  dagCode,
}) => {
  const downloadDag = () => {
    if (!dagCode) return;

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .split(".")[0];

    const fileName = `dag_${timestamp}.py`;

    const blob = new Blob([dagCode], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Collapse
      accordion
      style={{ marginTop: 24 }}
      defaultActiveKey={["script"]}
    >
      {/* 🔹 SAMPLE AIRFLOW SCRIPT */}
      <Panel header="Sample Airflow Script" key="script">
        <pre
          style={{
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
      </Panel>

      {/* 🔹 SMART SCHEDULING */}
      <Panel header="Smart Scheduling (How schedules work)" key="schedule">
        <Paragraph strong>SMART SCHEDULING</Paragraph>

        <Paragraph type="secondary">
          <Text strong>NOTE:</Text> All schedules will be converted to{" "}
          <Text strong>UTC timezone</Text> (Airflow requirement)
        </Paragraph>

        <Divider />

        <Paragraph strong>TIMEZONE EXAMPLES:</Paragraph>
        <ul>
          <li>daily at 9 AM EST → converts to UTC automatically</li>
          <li>business days at 2:30 PM PST → converts to UTC</li>
          <li>every Monday at 8 AM ET → converts to UTC</li>
        </ul>

        <Paragraph strong>OTHER SUPPORTED PATTERNS:</Paragraph>
        <ul>
          <li>every alternate Monday</li>
          <li>first Friday of month</li>
          <li>business days only</li>
          <li>
            Cron format (already UTC): <Text code>0 6 * * 1-5</Text>
          </li>
        </ul>

        <Divider />

        <Paragraph strong>Schedule examples:</Paragraph>
        <ul>
          <li>daily at 6 AM Eastern</li>
          <li>daily at 9 AM MST</li>
          <li>business days at 2:30 PM PST</li>
          <li>every alternate Monday</li>
          <li>first Monday of each month</li>
        </ul>

        <Divider />

        <Paragraph strong>Example conversion:</Paragraph>
        <Paragraph>
          <Text strong>Schedule description:</Text> daily at 7 PM
        </Paragraph>
        <Paragraph>
          <Text strong>Assumed EST conversion:</Text> 19:00 EST → 00:00 UTC
        </Paragraph>
        <Paragraph>
          <Text strong>Standard schedule (cron):</Text>{" "}
          <Text code>0 0 * * *</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Timezone:</Text> UTC (Airflow standard)
        </Paragraph>
      </Panel>

      {dagCode &&
        <Panel
          header="Generated DAG Code"
          key="generatedDAGCode"
          extra={
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // prevents panel collapse
                downloadDag();
              }}
            >
              Download
            </Button>
          }
        >
          <pre
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              overflowX: "auto",
            }}
          >
            {dagCode}
          </pre>
        </Panel>
      }
    </Collapse>
  );
};
