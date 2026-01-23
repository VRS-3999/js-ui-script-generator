import { DagFormConfig } from "../utils/types";

export const formConfig: DagFormConfig = {
  // DAG TYPE (always present)
  dagTypeField: {
    name: "dag_type",
    label: "DAG Type",
    type: "select",
    required: true,
    options: [
      { label: "BG SQL Executor", value: "bg_sql_executor" },
      { label: "BT to BQ Streaming", value: "bt_to_bq_streaming" },
      { label: "GCS Excel to BQ", value: "gcs_excel_to_bq" },
      { label: "Custom", value: "custom" }
    ]
  },

  // COMMON FIELDS (always present)
  commonFields: [
    {
      name: "dag_id",
      label: "DAG ID",
      type: "input",
      required: true,
      placeholder: "LOB-repo-name-dag-name",
      help: "Format: {LOB}-{repo-name}-{dag-name}"
    },
    {
      name: "username",
      label: "Username",
      type: "input",
      required: true,
      placeholder: "john_doe",
      pattern: "^[a-z_]+$",
      patternMessage: "Use lowercase letters and underscore only"
    },
    {
      name: "email",
      label: "Owner Email",
      type: "input",
      required: true,
      emailDomains: ["cvshealth.com", "aetna.com"]
    },
    {
      name: "notify_success",
      label: "Send Email on Success",
      type: "boolean"
    },
    {
      name: "notify_failure",
      label: "Send Email on Failure",
      type: "boolean"
    },
    {
      name: "brief_description",
      label: "Brief Description",
      type: "textarea",
      required: true
    }
  ],

  // ENVIRONMENT METADATA
  environmentNotificationFields: [
    { environment: "dev", label: "Development Environment" },
    { environment: "test", label: "Test Environment" },
    { environment: "prod", label: "Production Environment" }
  ],

  // DAG-SPECIFIC FIELDS
  dagForms: {
    bg_sql_executor: [
      {
        name: "schedule_description",
        label: "Schedule Description",
        type: "textarea",
        required: true,
        help: "Cron expression will be generated after confirmation"
      }
    ],
    bt_to_bq_streaming: [],
    gcs_excel_to_bq: [],
    custom: []
  }
};
