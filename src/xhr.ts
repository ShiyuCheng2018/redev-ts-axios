import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";
import { parseHeaders } from "./helpers/headers";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = "GET", headers, responseType, timeOut } = config;

		const request = new XMLHttpRequest(); // initial a standard XMLHttpRequest

		/*
		 *  handle promised request response
		 * */
		if (responseType) {
			// get responseType from config
			request.responseType = responseType;
		}

		if (timeOut) {
			request.timeout = timeOut;
		}

		request.open(method.toUpperCase(), url, true); // set request method and config URL

		request.onreadystatechange = function handleLoad() {
			// Ajax request status
			if (request.readyState !== 4) {
				// if server has received
				return null;
			}

			if (request.status === 0) {
				return;
			}

			const responseHeaders = parseHeaders(request.getAllResponseHeaders());
			const responseData = responseType !== "text" ? request.response : request.responseText;
			const response: AxiosResponse = {
				// initial response object
				data: responseData,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config,
				request,
			};
			handleResponse(response);
		};

		request.onerror = function handleErrors() {
			reject(new Error("Network Error"));
		};

		request.ontimeout = function handleTimeout() {
			reject(new Error(`Timeout  of  ${timeOut} ms exceeded.`));
		};

		/*
		 *  handle setting request header
		 * */
		Object.keys(headers).forEach((name) => {
			if (data === null && name.toLowerCase() === "content-type") {
				delete headers[name];
			} else {
				request.setRequestHeader(name, headers[name]);
			}
		});
		request.send(data);

		function handleResponse(response: AxiosResponse): void {
			if (response.status >= 200 && response.status < 300) {
				resolve(response);
			} else {
				reject(new Error(`Request failed with status code ${response.status}`));
			}
		}
	});
}
