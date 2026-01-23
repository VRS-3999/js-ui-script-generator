import { Form, Input, Select, Switch } from "antd";
import type { Rule } from "antd/es/form";
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
          placeholder="Enter email addresses"
          tokenSeparators={[",", " "]}
        />
      );

    default:
      return null;
  }
};

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

  if (field.emailDomains) {
    rules.push({
      validator: async (_, value) => {
        if (!value) return Promise.resolve();

        const values = Array.isArray(value) ? value : [value];
        const invalid = values.filter(email => {
          const domain = email.split("@")[1];
          return !field.emailDomains?.includes(domain);
        });

        if (invalid.length > 0) {
          return Promise.reject(
            new Error(
              `Allowed domains: ${field.emailDomains.join(", ")}`
            )
          );
        }
      }
    });
  }

  return rules;
};

export const DynamicFormFields: React.FC<{ fields: FormFieldConfig[] }> = ({
  fields
}) => (
  <>
    {fields.map(field => (
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
    ))}
  </>
);
