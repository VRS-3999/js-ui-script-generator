"use client";

import styles from "../../styles/central.module.css";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  { key: "duplicate", label: "Duplicate", extra: "Ctrl+Shift+D" },
  { key: "quickDuplicate", label: "Quick Duplicate", extra: "Ctrl+D" },
  { key: "copy", label: "Copy", extra: "Ctrl+C" },
  { key: "paste", label: "Paste", disabled: true, extra: "Ctrl+V" },
  { key: "delete", label: "Delete", extra: "Ctrl+Del" },
  { type: "divider" },
  { key: "createAdSet", label: "Create ad set" },
  { key: "createRule", label: "Create rule" },
  { type: "divider" },
  {
    key: "id",
    label: "ID: 32876387147987439",
    extra: "copy",
    disabled: true,
  },
];

interface ActionMenuProps {
  noBorder?: boolean;
}

const ActionMenu = ({ noBorder = false }: ActionMenuProps) => {
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <div
            className={`${styles.actionOptionContainer} ${
              noBorder ? styles.noBorderActionOptionContainer : ""
            }`}
          >
            <div className={styles.actionDots}>
              <i className={styles.dotActionMenu} />
              <i className={styles.dotActionMenu} />
              <i className={styles.dotActionMenu} />
            </div>
          </div>
        </Space>
      </a>
    </Dropdown>
  );
};

export default ActionMenu;
