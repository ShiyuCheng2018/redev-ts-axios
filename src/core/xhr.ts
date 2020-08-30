import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";
import { isURLSameOrigin } from "../helpers/url";
import cookie from "../helpers/cookie";
import { isFormData } from "../helpers/util";

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
			onUploadProgress,
			onDownloadProgress,
			auth,
		} = config;

		const request = new XMLHttpRequest(); // initial a standard XMLHttpRequest

		request.open(method.toUpperCase(), url!, true); // set request method and config URL

		configureRequest();
		addEvent();
		processHeaders();
		processCancel();

		request.send(data);

		function configureRequest(): void {
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
		}

		function addEvent(): void {
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
				const responseData =
					responseType !== "text" ? request.response : request.responseText;
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
					createError(
						`Timeout  of  ${timeOut} ms exceeded.`,
						config,
						"ECONNABORTED",
						request
					)
				);
			};

			if (onDownloadProgress) {
				request.onprogress = onDownloadProgress;
			}

			if (onUploadProgress) {
				request.upload.onprogress = onUploadProgress;
			}
		}

		function processHeaders(): void {
			if (isFormData(data)) {
				delete headers["Content-Type"];
			}

			if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
				const xsrfValue = cookie.read(xsrfCookieName);
				if (xsrfValue && xsrfHeaderName) {
					headers[xsrfHeaderName] = xsrfValue;
				}
			}

			if (auth) {
				headers["Authorization"] = "Basic " + btoa(auth.username + ":" + auth.password);
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
		}

		function processCancel(): void {
			if (cancelToken) {
				cancelToken.promise.then((reason) => {
					request.abort();
					reject(reason);
				});
			}
		}

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
