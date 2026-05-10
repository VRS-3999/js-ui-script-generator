import React, { useState, useRef, useEffect } from "react";
import {
  Collapse,
  Typography,
  Divider,
  Button,
  Input,
  message,
  Spin,
} from "antd";

import {
  DownloadOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { askDagQuestion } from "../api/generateScript";

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;
const { TextArea } = Input;

type ScriptGeneratorPreviewProps = {
  dagCode: string | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const ScriptGeneratorPreview: React.FC<
  ScriptGeneratorPreviewProps
> = ({ dagCode }) => {
  const [askPrompt, setAskPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    []
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ AUTO SCROLL TO BOTTOM
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, loading]);

  const downloadDag = () => {
    if (!dagCode) return;

    const now = new Date();

    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .split(".")[0];

    const fileName = `dag_${timestamp}.py`;

    const blob = new Blob([dagCode], {
      type: "text/x-python",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleAskSubmit = async () => {
    if (!askPrompt.trim()) {
      message.warning("Please enter your prompt");
      return;
    }

    if (!dagCode) {
      message.warning("DAG code not available");
      return;
    }

    const currentPrompt = askPrompt;

    // ✅ CLEAR INPUT
    setAskPrompt("");

    // ✅ ADD USER MESSAGE
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentPrompt,
      },
    ]);

    try {
      setLoading(true);

      const response = await askDagQuestion({
        dagCode,
        prompt: currentPrompt,
      });

      const assistantResponse = response;

      // ✅ ADD ASSISTANT MESSAGE
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantResponse,
        },
      ]);
    } catch (error: any) {
      console.error(error);

      message.error(
        error?.message || "Failed to get response"
      );

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.message ||
            "Something went wrong while processing your request",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
      <Panel
        header="Smart Scheduling (How schedules work)"
        key="schedule"
      >
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
            Cron format (already UTC):{" "}
            <Text code>0 6 * * 1-5</Text>
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

      {/* 🔹 GENERATED DAG */}
      {dagCode && (
        <Panel
          header="Generated DAG Code"
          key="generatedDAGCode"
          extra={
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                downloadDag();
              }}
            >
              Download
            </Button>
          }
        >
          {/* DAG CODE */}
          <pre
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              overflowX: "auto",
              fontSize: "14px",
            }}
          >
            {dagCode}
          </pre>

          <Divider />

          {/* CHAT SECTION */}
          <div>
            <Text strong>Ask About This DAG</Text>

            {/* CHAT HISTORY */}
            <div
              ref={chatContainerRef}
              style={{
                marginTop: 16,
                marginBottom: 16,
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: "#fafafa",
              }}
            >
              {chatMessages.length === 0 && (
                <Text type="secondary">
                  Ask questions about this DAG...
                </Text>
              )}

              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent:
                      msg.role === "user"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor:
                        msg.role === "user"
                          ? "#1677ff"
                          : "#ffffff",
                      color:
                        msg.role === "user"
                          ? "#ffffff"
                          : "#000000",
                      border:
                        msg.role === "assistant"
                          ? "1px solid #e8e8e8"
                          : "none",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* LOADING */}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <Spin size="small" />
                  </div>
                </div>
              )}
            </div>

            {/* INPUT AREA */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-end",
              }}
            >
              <TextArea
                rows={3}
                placeholder="Ask something about this DAG..."
                value={askPrompt}
                onChange={(e) =>
                  setAskPrompt(e.target.value)
                }
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleAskSubmit();
                  }
                }}
              />

              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleAskSubmit}
              >
                Send
              </Button>
            </div>
          </div>
        </Panel>
      )}
    </Collapse>
  );
};