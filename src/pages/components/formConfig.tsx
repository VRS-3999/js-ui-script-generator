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
      readOnly: true,
      placeholder: "tenant-repo-name-dag-name",
      help: "Auto-generated as {tenant}-{dag_repo}-{dag_name}"
    },
    {
      name: "tenant",
      label: "Tenant",
      type: "input",
      required: true,
    },
    {
      name: "dag_repo",
      label: "DAG Repo Name",
      type: "input",
      required: true,
    },
    {
      name: "dag_name",
      label: "DAG Name",
      type: "input",
      required: true,
    },
    {
      name: "lob",
      label: "LOB",
      type: "input",
      required: true,
    },
    {
      name: "app",
      label: "Application",
      type: "input",
      required: true,
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
      name: "cost_center",
      label: "Cost Center",
      type: "input",
      required: true
    },
    {
      name: "schedule_interval",
      label: "Schedule (Cron / Preset)",
      type: "input",
      required: true,
      help: "Stored as Airflow schedule_interval (UTC)",
      readOnly: true,
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
    },
    {
      name: "schedule_description",
      label: "Schedule Description",
      type: "textarea",
      required: true,
      help: "Cron expression will be generated after confirmation",
      action: {
        label: "Generate Cron",
        targetField: "schedule_interval",
        actionType: "GENERATE_CRON"
      }
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
    /* ─────────────────────────────────────────────
       BG SQL EXECUTOR
    ───────────────────────────────────────────── */
    bg_sql_executor: [
      {
        name: "sql_source_type",
        label: "SQL Source",
        type: "select",
        required: true,
        options: [
          { label: "Inline SQL", value: "inline_sql" },
          { label: "External SQL File", value: "external_sql" }
        ]
      },
      {
        name: "inline_sql_query",
        label: "SQL Query",
        type: "textarea",
        required: true,
        placeholder: "SELECT * FROM table_name;",
        showWhen: {
          field: "sql_source_type",
          equals: "inline_sql"
        }
      },
      {
        name: "external_sql_file",
        label: "Upload SQL File",
        type: "file",
        required: true,
        showWhen: {
          field: "sql_source_type",
          equals: "external_sql"
        }
      },

      /* BQ-specific */
      {
        name: "bq_tenant",
        label: "BigQuery Tenant",
        type: "input",
        required: true
      },
      {
        name: "bq_table_id",
        label: "BigQuery Table",
        type: "input",
        required: true
      },
      {
        name: "bq_streaming_table_id",
        label: "BQ Streaming Temp Table",
        type: "input",
        required: true
      }
    ],


    /* ─────────────────────────────────────────────
       BT → BQ STREAMING
    ───────────────────────────────────────────── */
    bt_to_bq_streaming: [
      {
        name: "bt_instance_id",
        label: "Bigtable Instance ID",
        type: "input",
        required: true
      },
      {
        name: "bt_table_id",
        label: "Bigtable Table ID",
        type: "input",
        required: true
      },
      {
        name: "bt_column_id",
        label: "Bigtable Column Family",
        type: "input",
        required: true
      },
      {
        name: "bq_tenant",
        label: "BigQuery Tenant",
        type: "input",
        required: true
      },
      {
        name: "bq_table_id",
        label: "BigQuery Table ID",
        type: "input",
        required: true
      },
      {
        name: "temp_bucket",
        label: "Temporary GCS Bucket",
        type: "input",
        required: true
      },
      {
        name: "dataflow_job_name",
        label: "Dataflow Job Name",
        type: "input",
        required: true
      }
    ],


    /* ─────────────────────────────────────────────
       GCS EXCEL → BQ
    ───────────────────────────────────────────── */
    /* ─────────────────────────────────────────────
   GCS FILE (CSV / EXCEL) → BQ
───────────────────────────────────────────── */
    gcs_excel_to_bq: [
      {
        name: "table_name",
        label: "Table Name",
        type: "input",
        required: true,
        placeholder: "Enter Table Name"
      },
      {
        name: "gcs_source_path",
        label: "GCS Source Path",
        type: "input",
        required: true,
        placeholder: "gs://bucket/folder/file.csv or *.xlsx"
      },
      {
        name: "source_format",
        label: "Source Format",
        type: "select",
        required: true,
        options: [
          { label: "CSV", value: "csv" },
          { label: "Excel (XLSX)", value: "excel" }
        ]
      },
      {
        name: "skip_leading_rows",
        label: "Skip Leading Rows",
        type: "number",
        required: false,
        min: 0,
        step: 1
      },
      {
        name: "field_delimiter",
        label: "Field Delimiter",
        type: "input",
        required: false,
        placeholder: ",",
        help: "Used only when source format is CSV",
        showWhen: {
          field: "source_format",
          equals: "csv"
        }
      },
      {
        name: "autodetect",
        label: "Auto-detect Schema",
        type: "boolean",
        required: false
      },
      {
        name: "allow_jagged_rows",
        label: "Allow Jagged Rows",
        type: "boolean",
        required: false,
        showWhen: {
          field: "source_format",
          equals: "csv"
        }
      },
      {
        name: "ignore_unknown_values",
        label: "Ignore Unknown Values",
        type: "boolean",
        required: false
      },
      {
        name: "allow_quoted_newlines",
        label: "Allow Quoted Newlines",
        type: "boolean",
        required: false,
        showWhen: {
          field: "source_format",
          equals: "csv"
        }
      },
      {
        name: "table_schema",
        label: "Table Schema (JSON Format)",
        type: "textarea",
        required: false,
        placeholder: '[{"name":"col1","type":"STRING"}]',
        help: "Provide JSON schema if autodetect is false"
      },
      {
        name: "create_table",
        label: "Create Table If Not Exists",
        type: "boolean",
        required: false
      },
      {
        name: "create_table_sql",
        label: "Create Table SQL",
        type: "textarea",
        required: false,
        placeholder: "CREATE TABLE dataset.table (...)",
        showWhen: {
          field: "create_table",
          equals: true
        }
      },
      {
        name: "load_data_sql",
        label: "Load Data SQL (Optional Override)",
        type: "textarea",
        required: false,
        placeholder: "LOAD DATA INTO dataset.table FROM FILES(...)"
      }
    ],


    /* ─────────────────────────────────────────────
       CUSTOM DAG
    ───────────────────────────────────────────── */
    custom: [
      {
        name: "custom_capabilities",
        label: "Supported Custom Use Cases",
        type: "select",
        required: false,
        options: [
          { label: "Dataproc processing pipelines", value: "dataproc_processing" },
          { label: "Bigtable migrations", value: "bt_migration" },
          { label: "Complex analytics with secrets / Redis", value: "complex_analytics" },
          { label: "Multi-step workflows with triggers", value: "multi_step_workflows" },
          { label: "Any other enterprise data pipeline needs", value: "other" }
        ]
      },
      {
        name: "custom_description",
        label: "Describe what your DAG should do",
        type: "textarea",
        required: true,
        placeholder: "Explain the workflow, data sources, triggers, and outputs"
      },
      {
        name: "operation_type",
        label: "Operation Type (Optional – helps generate better samples)",
        type: "select",
        required: false,
        placeholder: "beam_pipeline",
        options: [
          { label: "Dataproc Processing", value: "dataproc_processing" },
          { label: "Bigtable Migration", value: "bt_migration" },
          { label: "Beam Pipeline", value: "beam_pipeline" },
          { label: "Complex Analytics", value: "complex_analytics" }
        ]
      }
    ]
  }
};
