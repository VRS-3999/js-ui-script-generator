export type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "boolean"
  | "email_list"
  | "file";

/* ──────────────────────────────
   SELECT OPTIONS
────────────────────────────── */
export interface SelectOption {
  label: string;
  value: string;
}

/* ──────────────────────────────
   CONDITIONAL VISIBILITY
────────────────────────────── */
export interface ShowWhenCondition {
  field: string;
  equals: string | boolean;
}

/* ──────────────────────────────
   FIELD ACTION (NEW)
────────────────────────────── */
export interface FieldActionConfig {
  label: string;                // Button label (e.g. "Generate Cron")
  targetField: string;          // Field to update (e.g. schedule_interval)
  actionType: string;
}

/* ──────────────────────────────
   FORM FIELD CONFIG
────────────────────────────── */
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

  // conditional visibility
  showWhen?: ShowWhenCondition;

  // ACTION BUTTON (NEW)
  action?: FieldActionConfig;

  // UX helpers (optional but useful)
  readOnly?: boolean;
  disabled?: boolean;
}

/* ──────────────────────────────
   ENVIRONMENT CONFIG
────────────────────────────── */
export interface EnvironmentConfig {
  environment: "dev" | "test" | "prod";
  label: string;
}

/* ──────────────────────────────
   DAG TYPES
────────────────────────────── */
export type DagType =
  | "bg_sql_executor"
  | "bt_to_bq_streaming"
  | "gcs_excel_to_bq"
  | "custom";

/* ──────────────────────────────
   DAG FORM CONFIG
────────────────────────────── */
export interface DagFormConfig {
  dagTypeField: FormFieldConfig;
  commonFields: FormFieldConfig[];
  environmentNotificationFields: EnvironmentConfig[];
  dagForms: Record<DagType, FormFieldConfig[]>;
}
