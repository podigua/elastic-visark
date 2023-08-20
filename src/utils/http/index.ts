import Axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CustomParamsSerializer
} from "axios";
import {
    PureHttpError,
    RequestMethods,
    PureHttpResponse,
    PureHttpRequestConfig
} from "./types.d";
import {stringify} from "qs";
import NProgress from "../progress";
import {getAuthorization} from "@/utils/auth";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
    // 请求超时时间
    timeout: 10000,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
    paramsSerializer: {
        serialize: stringify as unknown as CustomParamsSerializer
    }
};

class PureHttp {
    constructor() {
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }

    /** 初始化配置对象 */
    private static initConfig: PureHttpRequestConfig = {};

    /** 保存当前Axios实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);


    /** 请求拦截 */
    private httpInterceptorsRequest(): void {
        PureHttp.axiosInstance.interceptors.request.use(
            async (config: PureHttpRequestConfig): Promise<any> => {
                // 开启进度条动画
                NProgress.start();
                // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
                if (typeof config.beforeRequestCallback === "function") {
                    config.beforeRequestCallback(config);
                    return config;
                }
                if (PureHttp.initConfig.beforeRequestCallback) {
                    PureHttp.initConfig.beforeRequestCallback(config);
                    return config;
                }
                return new Promise((resolve) => {
                    if (config.headers && getAuthorization()) {
                        config.headers["Authorization"] = getAuthorization();
                    }
                    resolve(config);
                })
            },
            error => {
                return Promise.reject(error);
            }
        );
    }

    /** 响应拦截 */
    private httpInterceptorsResponse(): void {
        const instance = PureHttp.axiosInstance;
        instance.interceptors.response.use(
            (response: PureHttpResponse) => {
                NProgress.done();
                return response.data;
            },
            (error: PureHttpError) => {
                NProgress.done();
                const $error = error;
                $error.isCancelRequest = Axios.isCancel($error);
                return Promise.reject($error);
            }
        );
    }

    /** 通用请求工具函数 */
    public request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: PureHttpRequestConfig
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param,
            ...axiosConfig
        } as PureHttpRequestConfig;

        // 单独处理自定义请求/响应回调
        return new Promise((resolve, reject) => {
            PureHttp.axiosInstance
                .request(config)
                .then((response: any) => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /** 单独抽离的post工具函数 */
    public post<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: PureHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("post", url, params, config);
    }

    /** 单独抽离的get工具函数 */
    public get<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: PureHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("get", url, params, config);
    }
}

export const http = new PureHttp();
