import { Form, Button, Select, Divider } from "antd";
import { useState } from "react";
import { formConfig } from "./formConfig";
import { DynamicFormFields } from "../components/DynamicFormFields";
import { DagType } from "../utils/types";
import styles from "../../styles/central.module.css"
import { generateDagScript } from "../api/generateScript";

export const DagForm: React.FC = () => {
    const [form] = Form.useForm();
    const [dagType, setDagType] = useState<DagType>();


    const onSubmit = async (values: any) => {
        try {
            const response = await generateDagScript(values);
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
