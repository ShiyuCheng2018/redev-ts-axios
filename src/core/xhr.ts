import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";
import { isURLSameOrigin } from "../helpers/url";
import cookie from "../helpers/cookie";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const {
			data = null,
			url,
			method = "GET",
			headers,
			responseType,
			timeOut,
			cancelToken,
			withCredentials,
			xsrfHeaderName,
			xsrfCookieName,
		} = config;

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

		if (withCredentials) {
			request.withCredentials = withCredentials;
		}

		request.open(method.toUpperCase(), url!, true); // set request method and config URL

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
			reject(createError("Network Error", config, null, request));
		};

		request.ontimeout = function handleTimeout() {
			reject(
				createError(`Timeout  of  ${timeOut} ms exceeded.`, config, "ECONNABORTED", request)
			);
		};

		if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
			const xsrfValue = cookie.read(xsrfCookieName);
			if (xsrfValue && xsrfHeaderName) {
				headers[xsrfHeaderName] = xsrfValue;
			}
		}

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

		if (cancelToken) {
			cancelToken.promise.then((reason) => {
				request.abort();
				reject(reason);
			});
		}

		request.send(data);

		function handleResponse(response: AxiosResponse): void {
			if (response.status >= 200 && response.status < 300) {
				resolve(response);
			} else {
				reject(
					createError(
						`Request failed with status code ${response.status}`,
						config,
						null,
						request,
						response
					)
				);
			}
		}
	});
}
