import { AxiosRequestConfig } from "../types";
import { deepMerge, isPlainObject } from "../helpers/util";
import { type } from "os";

/***********************************************************************************************************************
 * 													strategies        												   *
 * *********************************************************************************************************************/

function defaultField(primary: any, secondary: any): any {
	return typeof secondary !== "undefined" ? secondary : primary;
}

function fromSecondaryField(primary: any, secondary: any): any {
	if (typeof secondary !== "undefined") {
		return secondary;
	}
}

function deepMergeField(primary: any, secondary: any): any {
	if (isPlainObject(secondary)) {
		return deepMerge(primary, secondary);
	} else if (typeof secondary !== "undefined") {
		return secondary;
	} else if (isPlainObject(primary)) {
		return deepMerge(primary);
	} else if (typeof primary !== "undefined") {
		return primary;
	}
}

/***********************************************************************************************************************
 * 												mapping strategies    												   *
 * *********************************************************************************************************************/

const fields = Object.create(null);

const fieldKeysFromSecondary = ["url", "params", "data"];
fieldKeysFromSecondary.forEach((key) => {
	fields[key] = fromSecondaryField;
});

const fieldKeysDeepMerge = ["headers"];
fieldKeysDeepMerge.forEach((key) => {
	fields[key] = deepMergeField;
});

/***********************************************************************************************************************
 * 													main function    												   *
 * *********************************************************************************************************************/

export default function mergeConfig(primary: AxiosRequestConfig, secondary: AxiosRequestConfig) {
	if (!secondary) {
		secondary = {};
	}

	const config = Object.create(null);

	for (let key in secondary) {
		mergeFields(key);
	}

	for (let key in primary) {
		if (!secondary[key]) {
			mergeFields(key);
		}
	}

	function mergeFields(key: string): void {
		const field = fields[key] || defaultField;
		config[key] = field(primary[key], secondary[key]);
	}

	return config;
}
