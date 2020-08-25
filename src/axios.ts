import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";
import xhr from "./xhr";
import { buildURL } from "./helpers/url";
import { transformRequest, transformResponse } from "./helpers/data";
import { processHeaders } from "./helpers/headers";

function axios(config: AxiosRequestConfig): AxiosPromise {
	processConfig(config);
	return xhr(config).then((resolve) => {
		return transformResponseData(resolve);
	});
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config);
	config.headers = transformHeaders(config);
	config.data = transformRequestData(config);
}

function transformURL(config: AxiosRequestConfig): string {
	const { url, params } = config;
	return buildURL(url, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
	return transformRequest(config.data);
}

function transformHeaders(config: AxiosRequestConfig): any {
	const { headers = {}, data } = config;
	return processHeaders(headers, data);
}

function transformResponseData(resolve: AxiosResponse): AxiosResponse {
	resolve.data = transformResponse(resolve.data);
	return resolve;
}

export default axios;