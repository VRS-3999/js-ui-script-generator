import { Form, Button, Select, Divider } from "antd";
import { useState, useEffect } from "react";
import { formConfig } from "./formConfig";
import { DynamicFormFields } from "../components/DynamicFormFields";
import { DagType } from "../utils/types";
import styles from "../../styles/central.module.css"
import { generateDagScript } from "../api/generateScript";

type DagFormProps = {
    setDagCode: React.Dispatch<React.SetStateAction<string | null>>;
};

export const DagForm: React.FC<DagFormProps> = ({
    setDagCode,
}) => {
    const [form] = Form.useForm();
    const [dagType, setDagType] = useState<DagType>();

    const tenant = Form.useWatch("tenant", form);
    const dagRepo = Form.useWatch("dag_repo", form);
    const dagName = Form.useWatch("dag_name", form);

    useEffect(() => {
        if (!tenant || !dagRepo || !dagName) {
            form.setFieldsValue({ dag_id: "" });
            return;
        }

        const dagId = `${tenant}-${dagRepo}-${dagName}`
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/--+/g, "-")
            .replace(/^-|-$/g, "");

        form.setFieldsValue({ dag_id: dagId });
    }, [tenant, dagRepo, dagName, form]);


    const onSubmit = async (values: Record<string, unknown>) => {
        try {
            const payload: Record<string, unknown> = { ...values };

            const inlineKeys = Object.keys(values).filter(k => k.startsWith("inline_sql_query_"));
            const externalKeys = Object.keys(values).filter(k => k.startsWith("external_sql_file_"));

            payload.inline_sql_count = inlineKeys.length;
            payload.external_sql_file_count = externalKeys.length;

            const response = await generateDagScript(payload) as { dag_code?: string };
            const dagCode = response?.dag_code;
            setDagCode(dagCode ?? "DAG CODE NOT GENERATED");
        } catch (err) {
            console.error("Submission failed", err);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            className={styles.formDisplay}
        >
            {/* DAG TYPE */}
            <Form.Item
                name={formConfig.dagTypeField.name}
                label={formConfig.dagTypeField.label}
                rules={[{ required: true }]}
            >
                <Select
                    options={formConfig.dagTypeField.options}
                    placeholder="Select DAG Type"
                    onChange={setDagType}
                />
            </Form.Item>

            {/* COMMON FIELDS */}
            <Divider>Basic DAG Information</Divider>
            <DynamicFormFields fields={formConfig.commonFields} />

            {/* DAG-SPECIFIC FIELDS */}
            {dagType && formConfig.dagForms[dagType].length > 0 && (
                <>
                    <Divider>DAG Specific Configuration</Divider>
                    <DynamicFormFields fields={formConfig.dagForms[dagType]} />
                </>
            )}

            {/* ENVIRONMENT NOTIFICATIONS */}
            <Divider>Environment Notifications</Divider>

            {formConfig.environmentNotificationFields.map(env => (
                <div key={env.environment}>
                    <Divider>{env.label}</Divider>

                    <DynamicFormFields
                        fields={[
                            {
                                name: `${env.environment}_resource_sa`,
                                label: "Resource Service Account",
                                type: "input",
                                required: true,
                                placeholder: `${env.environment}-resource@project.iam.gserviceaccount.com`,
                                pattern: "^[a-z0-9-]+@[a-z0-9-]+\\.iam\\.gserviceaccount\\.com$",
                                patternMessage: "Enter valid GCP service account email"
                            },
                            {
                                name: `${env.environment}_connect_sa`,
                                label: "Connect Service Account",
                                type: "input",
                                required: true,
                                placeholder: `${env.environment}-connect@project.iam.gserviceaccount.com`,
                                pattern: "^[a-z0-9-]+@[a-z0-9-]+\\.iam\\.gserviceaccount\\.com$",
                                patternMessage: "Enter valid GCP service account email"
                            },
                            {
                                name: `${env.environment}_success_emails`,
                                label: "Success Notification Emails",
                                type: "email_list",
                                emailDomains: ["cvshealth.com", "aetna.com"]
                            },
                            {
                                name: `${env.environment}_failure_emails`,
                                label: "Failure Notification Emails",
                                type: "email_list",
                                emailDomains: ["cvshealth.com", "aetna.com"]
                            }
                        ]}
                    />
                </div>
            ))}

            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form>
    );
};
