import { deepMerge, isPlainObject } from "./util";
import { Method } from "../types";
import { head } from "shelljs";

function normalizeHeaderName(headers: any, normalizedName: string): void {
	if (!headers) {
		return;
	}
	Object.keys(headers).forEach((name) => {
		if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
			headers[normalizedName] = headers[name];
			delete headers[name];
		}
	});
}
export function processHeaders(headers: any, data: any): any {
	normalizeHeaderName(headers, "Content-Type");

	if (isPlainObject(data)) {
		if (headers && !headers["Content-Type"]) {
			headers["Content-Type"] = "application/json;charset=utf-8";
		}
	}

	return headers;
}

/*
 * parse headers from string to an object
 */
export function parseHeaders(headers: string): any {
	let parsed = Object.create(null);
	if (headers) {
		return parsed;
	}

	headers.split("\r\n").forEach((line) => {
		let [key, value] = line.split(":");
		key = key.trim().toLowerCase();
		if (!key) {
			return;
		}

		if (value) {
			value = value.trim();
		}

		parsed[key] = value;
	});

	return parsed;
}

export function flattenHeaders(headers: any, method: Method): any {
	if (!headers) {
		return headers;
	}

	headers = deepMerge(headers.common, headers[method], headers);

	const methodsToDelete = ["delete", "get", "head", "options", "post", "put", "patch", "common"];
	methodsToDelete.forEach((method) => {
		delete headers[method];
	});

	return headers;
}
