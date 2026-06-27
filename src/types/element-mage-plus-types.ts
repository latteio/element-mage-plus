import {Component} from "vue";

export declare interface AppConfiguration {
  /* basic */
  code?: string;
  name?: string;
  version?: string;
  active: string;
  profiles?: Record<string, AppProfile>;
  /* extended */
  lang?: string;
  locales?: any;
  logo?: any;
  theme?: string;
  layout?: string;
  layoutMobile?: boolean;
  layoutTags?: boolean;
  menuIsCollapse?: boolean;
  menuUniqueOpened?: boolean;
  dashboardUrl?: string;
  rsaPublicKey?: string;
}

export declare interface AppProfile {
  name?: string;
  secretName?: string;
  appBase?: string;
  apiBaseUrl?: string;
  apiLoginUrl?: string;
}

export declare interface AppStorageType {
  set<T>(key: string, val: T): void;

  get(key: string): any;

  remove(key: string): void;

  clear(): void;

  setTokenStorage<T>(val: T): void;

  getTokenStorage(): AppTokenStorage;

  getStorageKey(key: string): string;
}

export declare interface AppTokenStorage {
  type?: string;
  accessToken?: string;
  refreshToken?: string;
}

export type MagElmType = "primary" | "info" | "success" | "warning" | "danger";
export type MagElmAlignType = "left" | "center" | "right";

export declare interface MagButtonType {
  type?: string;
  label?: string;
  disabled?: boolean;
  onClick?: Function;
}

export declare interface MagSelectOptionType {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export declare interface MagSelectTreeOptionType {
  value: string | number;
  label: string;
  disabled?: boolean;
  children?: [];
}

export declare interface MagDropdownOptionType {
  value: [string, number, object];
  label: string;
  disabled?: boolean;
  divided?: boolean;
  icon?: [string, Component];
}

export declare interface MagTableColumnTagOptionType {
  value: string | number;
  label?: string;
  type?: MagElmType;
  color?: string;
}

export declare interface MagTableColumnSortType {
  sortNo: number;
}

export enum MagTablePaginationBarType {
  Search = "search",
}

export declare interface MagTableData {
  pageNum: number;
  pageSize: number;
  total: number;
  records: Array<any>;
}

export type  ElmDirectionType = "rtl" | "ltr" | "ttb" | "btt";

export declare interface MagDialogModel {
  visible: boolean;
  appendToBody?: boolean;
  fullscreen?: boolean;
  header?: string;
  headerAlign?: MagElmAlignType;
  direction?: ElmDirectionType;
  width?: string;
  height?: string;
  url?: string;
  footerAlign?: MagElmAlignType;
  showConfirmBtn?: boolean;
  showCancelBtn?: boolean;
  mode?: string;
  data?: any;
  onClose?: (val: any) => void;
}

export enum MagFilterType {
  INPUT = "input",
  SELECT = "select",
  SELECT_DATE = "selectDate",
  SELECT_TABLE = "selectTable",
  SELECT_TREE = "selectTree",
}
