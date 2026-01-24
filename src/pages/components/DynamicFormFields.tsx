import { Form, Input, Select, Switch, Upload, Button } from "antd";
import type { Rule } from "antd/es/form";
import { UploadOutlined } from "@ant-design/icons";
import { FormFieldConfig } from "../utils/types";

const { TextArea } = Input;

const renderField = (field: FormFieldConfig) => {
  switch (field.type) {
    case "input":
      return <Input placeholder={field.placeholder} />;

    case "textarea":
      return <TextArea rows={4} placeholder={field.placeholder} />;

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
