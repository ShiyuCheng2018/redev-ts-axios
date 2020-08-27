import { AxiosRequestConfig } from "../types";

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

/***********************************************************************************************************************
 * 													main function    												   *
 * *********************************************************************************************************************/

export default function mergeConfig(primary: AxiosRequestConfig, secondary: AxiosRequestConfig) {
	if (!secondary) {
		secondary = {};
	}

	const fields = Object.create(null);

	const fieldKeysFromSecondary = ["url", "params", "data"];
	fieldKeysFromSecondary.forEach((key) => {
		fields[key] = fromSecondaryField;
	});

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
