import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  message,
  Modal,
  InputNumber
} from "antd";
import type { Rule } from "antd/es/form";
import { UploadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { FormFieldConfig } from "../utils/types";
import { generateCronScheduleSyntax, getManagerDefaults, getManagers } from "../api/generateScript";

const { TextArea } = Input;

/* ------------------------- RULE BUILDER ------------------------- */
const buildRules = (field: FormFieldConfig): Rule[] => {
  const rules: Rule[] = [];

  if (field.required) {
    rules.push({
      required: true,
      message: `${field.label} is required`
    });
  }

  if (field.pattern) {
    rules.push({
      pattern: new RegExp(field.pattern),
      message: field.patternMessage
    });
  }

  if (field.type === "number") {
    rules.push({
      type: "number",
      transform: (value) => {
        if (value === undefined || value === null || value === "") {
          return undefined;
        }
        return Number(value);
      },
      message: `${field.label} must be a valid number`
    });

    if (field.min !== undefined) {
      rules.push({
        validator: (_, value) => {
          if (value === undefined || value === null) return Promise.resolve();
          return value >= field.min!
            ? Promise.resolve()
            : Promise.reject(new Error(`Minimum value is ${field.min}`));
        }
      });
    }

    if (field.max !== undefined) {
      rules.push({
        validator: (_, value) => {
          if (value === undefined || value === null) return Promise.resolve();
          return value <= field.max!
            ? Promise.resolve()
            : Promise.reject(new Error(`Maximum value is ${field.max}`));
        }
      });
    }
  }

  if (field.emailDomains) {
    rules.push({
      validator: async (_, value) => {
        if (!value) return Promise.resolve();

        const values = Array.isArray(value) ? value : [value];
        const invalid = values.filter(email => {
          const domain = email.split("@")[1];
          return !field.emailDomains!.includes(domain);
        });

        return invalid.length
          ? Promise.reject(
            new Error(`Allowed domains: ${field.emailDomains!.join(", ")}`)
          )
          : Promise.resolve();
      }
    });
  }

  return rules;
};

/* ---------------------- MAIN COMPONENT ---------------------- */
export const DynamicFormFields: React.FC<{ fields: FormFieldConfig[] }> = ({
  fields
}) => {
  const form = Form.useFormInstance();
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [managers, setManagers] = useState<{ label: string; value: string }[]>([]);

  const [inlineSqlKeys, setInlineSqlKeys] = useState<number[]>([0]);
  const [externalSqlKeys, setExternalSqlKeys] = useState<number[]>([0]);
  const [nextInlineIndex, setNextInlineIndex] = useState(1);
  const [nextExternalIndex, setNextExternalIndex] = useState(1);

  /* ---------- COLLECT ALL showWhen DEPENDENCIES ---------- */
  const formValues = Form.useWatch([], form);
  const sourceSelection = Form.useWatch("sql_source_type", form);
  const managerValue = Form.useWatch("manager", form);

  React.useEffect(() => {
    if (sourceSelection === "inline_sql") {
      setInlineSqlKeys(prev => (prev.length ? prev : [0]));
      setExternalSqlKeys([0]);
      setNextInlineIndex(prev => Math.max(prev, 1));
    } else if (sourceSelection === "external_sql") {
      setExternalSqlKeys(prev => (prev.length ? prev : [0]));
      setInlineSqlKeys([0]);
      setNextExternalIndex(prev => Math.max(prev, 1));
    } else {
      setInlineSqlKeys([0]);
      setExternalSqlKeys([0]);
    }
  }, [sourceSelection]);

  React.useEffect(() => {
    if (!formValues) return;

    fields.forEach(field => {
      if (field.showWhen) {
        const actualValue = formValues[field.showWhen.field];

        if (actualValue !== field.showWhen.equals) {
          form.setFieldValue(field.name, undefined);
        }
      }
    });
  }, [formValues, fields, form]);

  React.useEffect(() => {
    if (!managerValue) return;

    const fetchDefaults = async () => {
      try {
        const result = await getManagerDefaults(managerValue);

        if (result?.data) {
          form.setFieldsValue({
            ...result.data
          });

        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load manager defaults");
      }
    };

    fetchDefaults();
  }, [managerValue, form]);

  React.useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await getManagers();

        if (res?.data) {
          setManagers(res.data);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load managers");
      }
    };

    fetchManagers();
  }, []);

  /* -------------------- ACTION HANDLER -------------------- */
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
          throw new Error("Unsupported action type");
      }

      const cron = result?.data;
      if (!cron) throw new Error("Invalid cron response");

      Modal.confirm({
        title: "Confirm Schedule",
        content: (
          <>
            <p>The following cron expression (UTC) will be applied:</p>
            <pre style={{ fontWeight: 600 }}>{cron}</pre>
          </>
        ),
        okText: "Use this schedule",
        cancelText: "Cancel",
        onOk: () => {
          form.setFieldValue(field.action!.targetField, cron);
          message.success("Schedule applied successfully");
        },
        onCancel: () => {
          form.setFieldValue(field.action!.targetField, null);
        }
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to generate cron expression");
    } finally {
      setLoadingField(null);
    }
  };

  /* ------------------ REPEATABLE FIELD HELPERS ------------------ */
  const renderRepeatableField = (field: FormFieldConfig) => {
    const isInline = field.name === "inline_sql_query";
    const keys = isInline ? inlineSqlKeys : externalSqlKeys;
    const setKeys = isInline ? setInlineSqlKeys : setExternalSqlKeys;
    const nextIndex = isInline ? nextInlineIndex : nextExternalIndex;
    const setNextIndex = isInline ? setNextInlineIndex : setNextExternalIndex;
    const fieldBaseName = field.name;

    const addItem = () => {
      setKeys([...keys, nextIndex]);
      setNextIndex(nextIndex + 1);
    };

    const removeItem = (itemIndex: number) => {
      if (keys.length <= 1) return;
      setKeys(keys.filter((k) => k !== itemIndex));
      form.setFieldValue(`${fieldBaseName}_${itemIndex}`, undefined);
    };

    return (
      <>
        {keys.map((itemIndex) => (
          <div key={`${fieldBaseName}_${itemIndex}`} style={{ marginBottom: 12 }}>
            <Form.Item
              name={`${fieldBaseName}_${itemIndex}`}
              label={`${field.label} #${itemIndex + 1}`}
              rules={buildRules(field)}
              help={field.help}
              valuePropName={field.type === "boolean" ? "checked" : "value"}
            >
              {isInline ? (
                <TextArea
                  rows={4}
                  placeholder={field.placeholder}
                  onChange={(e) => {
                    form.setFieldValue(`${fieldBaseName}_${itemIndex}`, e.target.value);
                  }}
                />
              ) : (
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload File</Button>
                </Upload>
              )}
            </Form.Item>

            <Button type="link" danger onClick={() => removeItem(itemIndex)}>
              Remove {isInline ? "Inline SQL" : "External SQL File"}
            </Button>
          </div>
        ))}

        <Button type="dashed" onClick={addItem} style={{ width: "100%" }}>
          Add {isInline ? "Inline SQL" : "External SQL File"}
        </Button>
      </>
    );
  };

  /* ---------------------- FIELD RENDERER ---------------------- */
  const renderField = (field: FormFieldConfig) => {
    switch (field.type) {
      case "input":
        return (
          <Input
            placeholder={field.placeholder}
            readOnly={field.readOnly}
          />
        );

      case "textarea":
        return (
          <>
            <TextArea rows={4} placeholder={field.placeholder} 
              onChange={(e) => {
              form.setFieldValue(field.name, e.target.value);
            }}/>

            {field.action && (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  loading={loadingField === field.name}
                  onClick={() => handleAction(field)}
                >
                  {field.action.label}
                </Button>
              </div>
            )}
          </>
        );
        
      case "select":
        if (field.name === "manager") {
          return (
            <Select
              placeholder={field.placeholder}
              options={managers}
              showSearch
              optionFilterProp="label"
            />
          );
        }
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

      case "number":
        return (
          <InputNumber
            style={{ width: "100%" }}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            disabled={field.disabled}
          />
        );

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

  /* ------------------------- RENDER ------------------------- */
  return (
    <>
      {fields.map(field => {
        if (field.showWhen) {
          const actualValue = formValues?.[field.showWhen.field];
          if (actualValue !== field.showWhen.equals) {
            return null;
          }
        }

        if (field.name === "inline_sql_query" || field.name === "external_sql_file") {
          return <div key={field.name}>{renderRepeatableField(field)}</div>;
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
