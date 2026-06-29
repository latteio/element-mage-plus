import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {AppConfiguration, AppProfile, AppStorageType, AppTokenStorage} from "@/types";
import Message from '@/utils/Message';

const apiRequestInstaller = function (appConfig: AppConfiguration, session: AppStorageType) {
  /**
   * 创建实例
   */
  const activeProfile = appConfig?.active;
  const profiles = appConfig?.profiles;

  if (!activeProfile || !profiles || !profiles[activeProfile]) {
    throw new Error(`Invalid application configuration: active profile "${activeProfile}" not found`);
  }

  const appProfile: AppProfile = profiles[activeProfile];
  const apiRequest: AxiosInstance = axios.create({
    baseURL: appProfile?.apiBaseUrl,
    timeout: 120000,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  });

  /**
   * 请求拦截器
   */
  apiRequest.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const tos: AppTokenStorage = session?.getTokenStorage();

        /* 设置Token */
        if (tos?.accessToken && tos?.accessToken !== '') {
          config.headers["Authorization"] = tos?.type + ' ' + tos?.accessToken;
          config.headers["Refresh-Access-Token"] = "false";
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error.message);
      }
  );

  /**
   * 响应拦截器
   */
  apiRequest.interceptors.response.use(
      async (response: AxiosResponse) => {
        if (!response || !response.data) {
          return response;
        }

        // 响应数据为二进制流
        if (isBinaryResponse(response)) {
          const data = response.data;

          // 如果是Blob且Content-Type为application/json, 可能是错误响应
          if (data instanceof Blob && data.type === 'application/json') {
            return await handleBinaryError(data);
          }

          // 正常的二进制数据, 直接返回response对象
          return response;
        }

        // 响应数据为json
        const respData: any = response.data;
        const code = respData?.code ?? 0;
        const status = respData?.status ?? 599;
        const message = respData?.msg || respData?.message || "无效的返回数据";

        // 响应数据为json: 业务成功
        if (code === 1 || code === 200 || status === 200) {
          return response.data;
        }

        // 响应数据为json: 业务失败
        return Promise.reject(handleError(status, message));
      },
      async (error: any) => {
        // 处理HTTP错误响应中的二进制数据
        if (error.response && error.response.data) {
          const respData = error.response.data;

          // 处理错误响应中的二进制数据
          if (respData instanceof Blob) {
            return await handleBinaryError(respData);
          }

          // 处理JSON错误响应
          if (typeof respData === 'object' && respData !== null) {
            const status = respData?.status || error.response?.status || 599;
            const message = respData?.msg || respData?.message || error.message;
            return Promise.reject(handleError(status, message));
          }

          // 普通文本错误
          const status = error.response?.status || 599;
          return Promise.reject(handleError(status, error.message));
        }

        // 网络错误或超时
        return Promise.reject(handleError(504, error.message || '网络请求失败'));
      }
  );

  /**
   * 判断是否为二进制数据
   * @param response
   */
  const isBinaryResponse = (response: AxiosResponse): boolean => {
    const data = response.data;
    const config = response.config;

    return data instanceof ArrayBuffer ||
        data instanceof Blob ||
        config?.responseType === 'blob' ||
        config?.responseType === 'arraybuffer' ||
        config?.responseType === 'stream';
  }

  /**
   * 处理二进制响应中的错误信息
   * @param blob
   */
  const handleBinaryError = async (blob: Blob): Promise<any> => {
    return new Promise((_, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          // 尝试解析为JSON错误信息
          const errorData = JSON.parse(reader.result as string);
          const status = errorData?.status || 500;
          const message = errorData?.msg || errorData?.message || "请求失败";
          reject(handleError(status, message));
        } catch (e) {
          // 如果不是JSON格式，返回通用错误
          reject(handleError(500, "下载文件失败"));
        }
      };

      reader.onerror = () => {
        reject(handleError(500, "读取响应数据失败"));
      };

      reader.readAsText(blob);
    });
  }

  /**
   * 处理错误类型
   * @param status
   * @param msg
   */
  const handleError = (status: number, msg: string) => {
    switch (status) {
      case 401:
        Message.confirm('当前会话或授权已过期，现在重新登录吗？', '系统提示', function () {
          location.href = '#' + (appProfile.apiLoginUrl || '/login');
        });
        break;
      case 404:
        Message.error('服务或页面未找到');
        break;
      case 500:
        Message.error('<p style="margin-top: 5px;">' + msg + '</p>');
        break;
      default:
        Message.error('<p style="margin-top: 5px;">' + msg + '</p>');
    }

    return {status, msg};
  }

  return {
    ApiRequest: apiRequest
  }
}

export {
  apiRequestInstaller
}
