export type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "boolean"
  | "email_list"
  | "file";

export interface SelectOption {
  label: string;
  value: string;
}

export interface ShowWhenCondition {
  field: string;
  equals: string | boolean;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;

  // validation
  pattern?: string;
  patternMessage?: string;
  emailDomains?: string[];

  // select only
  options?: SelectOption[];

  // CONDITIONAL VISIBILITY
  showWhen?: ShowWhenCondition
}

export interface EnvironmentConfig {
  environment: "dev" | "test" | "prod";
  label: string;
}

export type DagType =
  | "bg_sql_executor"
  | "bt_to_bq_streaming"
  | "gcs_excel_to_bq"
  | "custom";

export interface DagFormConfig {
  dagTypeField: FormFieldConfig;
  commonFields: FormFieldConfig[];
  environmentNotificationFields: EnvironmentConfig[];
  dagForms: Record<DagType, FormFieldConfig[]>;
}
