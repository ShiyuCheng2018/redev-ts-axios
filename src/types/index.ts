export type Method =
	| "get"
	| "GET"
	| "delete"
	| "DEL"
	| "head"
	| "HEAD"
	| "options"
	| "OPTIONS"
	| "post"
	| "POST"
	| "put"
	| "PUT"
	| "patch"
	| "PATCH";

export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	data?: any;
	params?: any;
	headers?: any;
	responseType?: XMLHttpRequestResponseType; // "" | "arraybuffer" | "blob" | "document" | "json" | "text"
	timeOut?: number;
	withCredentials?: boolean;
	auth?: AxiosBasicCredentials;

	transformRequest?: AxiosTransformer | AxiosTransformer[];
	transformResponse?: AxiosTransformer | AxiosTransformer[];

	cancelToken?: CancelToken;

	xsrfCookieName?: string;
	xsrfHeaderName?: string;

	onDownloadProgress?: (e: ProgressEvent) => void;
	onUploadProgress?: (e: ProgressEvent) => void;

	[propName: string]: any;
}

export interface AxiosResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: any;
	config: AxiosRequestConfig;
	request: any;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
	isAxiosError: boolean;
	config: AxiosRequestConfig;
	code?: string | null;
	request?: any;
	response?: AxiosResponse;
}

export interface Axios {
	defaults: AxiosRequestConfig;
	interceptors: {
		request: AxiosInterceptorManger<AxiosRequestConfig>;
		response: AxiosInterceptorManger<AxiosResponse>;
	};
	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosInstance extends Axios {
	<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
	<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosStatic extends AxiosInstance {
	create(config?: AxiosRequestConfig): AxiosInstance;

	CancelToken: CancelTokenStatic;
	Cancel: CancelStatic;
	isCancel: (value: any) => boolean;
}

/***********************************************************************************************************************
 * 													Interceptor Interface 											   *
 * *********************************************************************************************************************/

export interface AxiosInterceptorManger<T> {
	use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
	eject(id: number): void;
}

export interface ResolvedFn<T> {
	(val: T): T | Promise<T>;
}

export interface RejectedFn {
	(error: any): any;
}

export interface AxiosTransformer {
	(data: any, headers?: any): any;
}

/***********************************************************************************************************************
 * 													Cancellation Interface 											   *
 * *********************************************************************************************************************/

export interface CancelToken {
	promise: Promise<Cancel>;
	reason?: Cancel;

	throwIfRequested(): void;
}

export interface Canceller {
	(message?: string): void;
}

export interface CancelExecutor {
	(cancel: Canceller): void;
}

export interface CancelTokenSource {
	token: CancelToken;
	cancel: Canceller;
}

export interface CancelTokenStatic {
	new (executor: CancelExecutor): CancelToken;
	source(): CancelTokenSource;
}

export interface Cancel {
	message?: string;
}

export interface CancelStatic {
	new (message?: string): Cancel;
}

/***********************************************************************************************************************
 * 													HTTP Authentication 											   *
 * *********************************************************************************************************************/

export interface AxiosBasicCredentials {
	username: string;
	password: string;
}
