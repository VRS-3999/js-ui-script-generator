import React, { useState } from "react";
import { Form, Input, Select, Switch, Upload, Button, Space, message } from "antd";
import type { Rule } from "antd/es/form";
import { UploadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { FormFieldConfig } from "../utils/types";
import { generateCronScheduleSyntax } from "../api/generateScript";

const { TextArea } = Input;

const buildRules = (field: FormFieldConfig): Rule[] => {
  const rules: Rule[] = [];

  if (field.required) {
    rules.push({ required: true, message: `${field.label} is required` });
  }

  if (field.pattern) {
    rules.push({
      pattern: new RegExp(field.pattern),
      message: field.patternMessage
    });
  }

  if (field.emailDomains) {
    rules.push({
      validator: async (_, value) => {
        if (!value) return Promise.resolve();
        const values = Array.isArray(value) ? value : [value];
        const invalid = values.filter(email => {
          const domain = email.split("@")[1];
          return !field.emailDomains?.includes(domain);
        });
        return invalid.length
          ? Promise.reject(`Allowed domains: ${field.emailDomains.join(", ")}`)
          : Promise.resolve();
      }
    });
  }

  return rules;
};

export const DynamicFormFields: React.FC<{ fields: FormFieldConfig[] }> = ({
  fields
}) => {
  const form = Form.useFormInstance();
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const handleAction = async (field: FormFieldConfig) => {
    if (!field.action) return;

    const description = form.getFieldValue(field.name);
    if (!description) {
      message.warning("Please enter schedule description first");
      return;
    }

    try {
      setLoadingField(field.name);

      let result;
      switch (field.action.actionType) {
        case "GENERATE_CRON":
          result = await generateCronScheduleSyntax({
            prompt: description
          });
          break;

        default:
          throw new Error("Unsupported action");
      }

      const cron = result?.data;
      if (!cron) {
        throw new Error("Invalid API response");
      }

      form.setFieldValue(field.action.targetField, cron);
      message.success("Cron generated successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to generate cron expression");
    } finally {
      setLoadingField(null);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    switch (field.type) {
      case "input":
        return <Input placeholder={field.placeholder} readOnly={field.readOnly} />;

      case "textarea":
        return (
          <Space direction="vertical" style={{ width: "100%" }}>
            <TextArea rows={4} placeholder={field.placeholder} />
            {field.action && (
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                loading={loadingField === field.name}
                onClick={() => handleAction(field)}
              >
                {field.action.label}
              </Button>
            )}
          </Space>
        );

      case "select":
        return (
          <Select placeholder={field.placeholder}>
            {field.options?.map(opt => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );

      case "boolean":
        return <Switch />;

      case "email_list":
        return (
          <Select
            mode="tags"
            tokenSeparators={[",", " "]}
            placeholder="Enter email addresses"
          />
        );

      case "file":
        return (
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {fields.map(field => {
        if (field.showWhen) {
          const watched = Form.useWatch(field.showWhen.field, form);
          if (watched !== field.showWhen.equals) return null;
        }

        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={buildRules(field)}
            help={field.help}
            valuePropName={field.type === "boolean" ? "checked" : "value"}
          >
            {renderField(field)}
          </Form.Item>
        );
      })}
    </>
  );
};
