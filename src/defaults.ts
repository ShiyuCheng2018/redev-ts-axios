import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
	method: "GET",
	timeOut: 0,
	headers: {
		common: {
			Accept: "application/json, text/plain, */*",
		},
	},
};

const methodsNoData = ["delete", "get", "head", "options"];

methodsNoData.forEach((method) => {
	defaults.headers[method] = {};
});

const methodWithData = ["post", "put", "patch"];

methodWithData.forEach((method) => {
	defaults.headers[method] = {
		"Content-Type": "application/x-www-form-urlencoded",
	};
});

export default defaults;
