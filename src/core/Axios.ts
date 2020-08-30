import {
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	Method,
	RejectedFn,
	ResolvedFn,
} from "../types";
import dispatchRequest, { transformURL } from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";

interface Interceptors {
	request: InterceptorManager<AxiosRequestConfig>;
	response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
	resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
	rejected?: RejectedFn;
}

export default class Axios {
	defaults: AxiosRequestConfig;
	interceptors: Interceptors;

	constructor(initConfig: AxiosRequestConfig) {
		this.defaults = initConfig;
		this.interceptors = {
			request: new InterceptorManager<AxiosRequestConfig>(),
			response: new InterceptorManager<AxiosResponse>(),
		};
	}

	request(url?: any, config?: any): AxiosPromise {
		if (typeof url === "string") {
			if (!config) {
				// config is undefined
				config = {};
			}
			config.url = url;
		} else {
			// url as config
			config = url;
		}

		config = mergeConfig(this.defaults, config);

		const chain: PromiseChain<any>[] = [
			{
				resolved: dispatchRequest,
				rejected: undefined,
			},
		];

		this.interceptors.request.foreach((interceptor) => {
			chain.unshift(interceptor);
		});

		this.interceptors.response.foreach((interceptor) => {
			chain.push(interceptor);
		});

		console.log(chain);

		return chain.reduce(
			(acc, cur) => acc.then(cur.resolved, cur.rejected),
			Promise.resolve(config)
		);
	}

	get(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("GET", url, config);
	}

	delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("DEL", url, config);
	}

	head(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("HEAD", url, config);
	}

	options(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("OPTIONS", url, config);
	}

	post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("POST", url, data, config);
	}

	put(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("PUT", url, data, config);
	}

	patch(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("PATCH", url, data, config);
	}

	getUrl(config?: AxiosRequestConfig): string {
		config = mergeConfig(this.defaults, config!);
		return transformURL(config!);
	}

	_requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
		return this.request(
			Object.assign(config || {}, {
				method,
				url,
			})
		);
	}

	_requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
		return this.request(
			Object.assign(config || {}, {
				method,
				url,
				data,
			})
		);
	}
}
