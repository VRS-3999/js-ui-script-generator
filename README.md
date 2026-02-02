This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.


## Sample Payload for Different Dag Type
```
{
  "dag_type": "bg_sql_executor",
  "dag_id": "dagid",
  "username": "username",
  "email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "brief_description": "this is a brief discussion",
  "schedule_description": "this is a scheduled description",
  "dev_success_emails": [
    "test1@cvshealth.com",
    "test2@cvshealth.com"
  ],
  "dev_failure_emails": [
    "test3@cvshealth.com",
    "test4@cvshealth.com"
  ],
  "test_success_emails": [
    "test5@cvshealth.com"
  ],
  "test_failure_emails": [
    "test6@cvshealth.com"
  ],
  "prod_success_emails": [
    "test7@cvshealth.com"
  ],
  "prod_failure_emails": [
    "test8@cvshealth.com"
  ],
  "sql_source_type": "inline_sql",
  "inline_sql_query": "this is sql query inline"
}
```
```
{
  "dag_type": "bg_sql_executor",
  "dag_id": "dagid",
  "username": "username",
  "email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "brief_description": "this is a brief discussion",
  "schedule_description": "this is a scheduled description",
  "dev_success_emails": [
    "test1@cvshealth.com",
    "test2@cvshealth.com"
  ],
  "dev_failure_emails": [
    "test3@cvshealth.com",
    "test4@cvshealth.com"
  ],
  "test_success_emails": [
    "test5@cvshealth.com"
  ],
  "test_failure_emails": [
    "test6@cvshealth.com"
  ],
  "prod_success_emails": [
    "test7@cvshealth.com"
  ],
  "prod_failure_emails": [
    "test8@cvshealth.com"
  ],
  "sql_source_type": "external_sql",
  "external_sql_file": {
    "file": {
      "uid": "rc-upload-1769242960119-3"
    },
    "fileList": [
      {
        "uid": "rc-upload-1769242960119-3",
        "lastModified": 1728466370000,
        "lastModifiedDate": "2024-10-09T09:32:50.000Z",
        "name": "AC_5.jpg",
        "size": 2315794,
        "type": "image/jpeg",
        "percent": 0,
        "originFileObj": {
          "uid": "rc-upload-1769242960119-3"
        }
      }
    ]
  }
}
```
BELOW IS BE REQUIREMENT
```
{
  "dag_id": "paops-auto-pa-bg-sql",
  "project_id": "anbc-pss-dev",
  "tenant": "paops",
  "app": "auto_pa",
  "lob": "pss",
  "region": "us-east4",
  "username": "rohit_patidar",
  "cost_center": "0000230810",
  "dag_repo": "auto-pa-features-update-bq",
  "dag_tags": [
    "tenant:paops",
    "app:auto_pa",
    "owner:ownermail@cvshealth.com"
  ],
  "bq_tenant": "pmcydealclnt",
  "bq_table_id": "auto_pa_audit_data_final",
  "bq_streaming_table_id": "auto_pa_audit_data_streaming_temp",
  "to_emails": ["test3@cvshealth.com"],
  "cc_emails": ["test4@cvshealth.com"],
  "owner_email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "schedule_interval": "0 * * * *",
  "sql_file_name": "bq_stream_table_to_view.sql"
}
```

```
{
  "dag_type": "bt_to_bq_streaming",
  "dag_id": "dagid",
  "username": "username",
  "email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "brief_description": "this is a brief discussion",
  "schedule_description": "this is a scheduled description",
  "dev_success_emails": [
    "test1@cvshealth.com",
    "test2@cvshealth.com"
  ],
  "dev_failure_emails": [
    "test3@cvshealth.com",
    "test4@cvshealth.com"
  ],
  "test_success_emails": [
    "test5@cvshealth.com"
  ],
  "test_failure_emails": [
    "test6@cvshealth.com"
  ],
  "prod_success_emails": [
    "test7@cvshealth.com"
  ],
  "prod_failure_emails": [
    "test8@cvshealth.com"
  ],
  "bt_instance_id": "BigInstance id",
  "bt_table_id": "bigtable id",
  "bt_column_family": "column family name",
  "bq_dataset_id": "bigquery dataaset ID",
  "bq_table_id": "BigQuery Table ID"
}
```
```
{
  "dag_type": "gcs_excel_to_bq",
  "dag_id": "dagid",
  "username": "username",
  "email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "brief_description": "this is a brief discussion",
  "schedule_description": "this is a scheduled description",
  "dev_success_emails": [
    "test1@cvshealth.com",
    "test2@cvshealth.com"
  ],
  "dev_failure_emails": [
    "test3@cvshealth.com",
    "test4@cvshealth.com"
  ],
  "test_success_emails": [
    "test5@cvshealth.com"
  ],
  "test_failure_emails": [
    "test6@cvshealth.com"
  ],
  "prod_success_emails": [
    "test7@cvshealth.com"
  ],
  "prod_failure_emails": [
    "test8@cvshealth.com"
  ],
  "gcs_source_path": "PATH TO SOURCE GSC",
  "bq_dataset": "Destination Bigquery Dataset input",
  "bq_table": "Destination BigQuery Table Input",
  "auto_fix_option": "convert_to_string"
}
```
```
{
  "dag_type": "custom",
  "dag_id": "dagid",
  "username": "username",
  "email": "ownermail@cvshealth.com",
  "notify_success": true,
  "notify_failure": true,
  "brief_description": "this is a brief discussion",
  "schedule_description": "this is a scheduled description",
  "dev_success_emails": [
    "test1@cvshealth.com",
    "test2@cvshealth.com"
  ],
  "dev_failure_emails": [
    "test3@cvshealth.com",
    "test4@cvshealth.com"
  ],
  "test_success_emails": [
    "test5@cvshealth.com"
  ],
  "test_failure_emails": [
    "test6@cvshealth.com"
  ],
  "prod_success_emails": [
    "test7@cvshealth.com"
  ],
  "prod_failure_emails": [
    "test8@cvshealth.com"
  ],
  "custom_capabilities": "dataproc_processing",
  "custom_description": "This is the description for Custom DAG",
  "operation_type": "dataproc_processing"
}
```

# API ENDPOINTS
1. Converting Schedule Description to cron Job
2. 

# UI Enhancement
1. Based on Toggle for notification, Input should be enabled for each environment for collecting email