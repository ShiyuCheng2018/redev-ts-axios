import axios from "../../src/index";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

/***********************************************************************************************************************
 * 													text for params 												   *
 * *********************************************************************************************************************/
axios({
	method: "get",
	url: "/base/get",
	params: {
		foo: ["bar", "baz"],
	},
});

axios({
	method: "get",
	url: "/base/get",
	params: {
		foo: {
			bar: "baz",
		},
	},
});

const date = new Date();

axios({
	method: "get",
	url: "/base/get",
	params: {
		date,
	},
});

axios({
	method: "get",
	url: "/base/get",
	params: {
		foo: "@:$, ",
	},
});

axios({
	method: "get",
	url: "/base/get",
	params: {
		foo: "bar",
		baz: null,
	},
});

axios({
	method: "get",
	url: "/base/get#hash",
	params: {
		foo: "bar",
	},
});

axios({
	method: "get",
	url: "/base/get?foo=bar",
	params: {
		bar: "baz",
	},
});

/***********************************************************************************************************************
 * 													text for data    												   *
 * *********************************************************************************************************************/

axios({
	method: "post",
	url: "/base/post",
	data: {
		a: 1,
		b: 2,
	},
});

const arr = new Int32Array([21, 31]);

axios({
	method: "post",
	url: "/base/buffer",
	data: arr,
});

axios({
	method: "post",
	url: "/base/post",
	data: {
		a: 1,
		b: 2,
	},
});

/***********************************************************************************************************************
 * 													text for headers 												   *
 * *********************************************************************************************************************/

axios({
	method: "post",
	url: "/base/post",
	headers: {
		"content-type": "application/json;",
	},
	data: {
		a: 1,
		b: 2,
	},
});

const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams = new URLSearchParams(paramsString);

axios({
	method: "post",
	url: "/base/post",
	data: searchParams,
});

/***********************************************************************************************************************
 * 													text for response data 											   *
 * *********************************************************************************************************************/

axios({
	method: "post",
	url: "/base/post",
	data: {
		a: 1,
		b: 2,
	},
}).then((res) => {
	console.log(res);
});

/**
 *
 */

axios({
	method: "post",
	url: "/base/post",
	responseType: "json",
	data: {
		a: 3,
		b: 4,
	},
}).then((res) => {
	console.log(res);
});

/***********************************************************************************************************************
 * 											text for download | upload 												   *
 * *********************************************************************************************************************/

const instance = axios.create();

function calculatePercentage(loaded: number, total: number) {
	return Math.floor(loaded * 1.0) / total;
}

function loadProgressBar() {
	const setupStartProgress = () => {
		instance.interceptors.request.use((config) => {
			NProgress.start();
			return config;
		});
	};

	const setupUpdateProgress = () => {
		const update = (e: ProgressEvent) => {
			console.log(e);
			NProgress.set(calculatePercentage(e.loaded, e.total));
		};
		instance.defaults.onDownloadProgress = update;
		instance.defaults.onUploadProgress = update;
	};

	const setupStopProgress = () => {
		instance.interceptors.response.use(
			(response) => {
				NProgress.done();
				return response;
			},
			(error) => {
				NProgress.done();
				return Promise.reject(error);
			}
		);
	};

	setupStartProgress();
	setupUpdateProgress();
	setupStopProgress();
}

loadProgressBar();

const downloadEl = document.getElementById("download");

downloadEl!.addEventListener("click", (e) => {
	instance.get("https://img.mukewang.com/5cc01a7b0001a33718720632.jpg");
});

const uploadEl = document.getElementById("upload");

uploadEl!.addEventListener("click", (e) => {
	const data = new FormData();
	const fileEl = document.getElementById("file") as HTMLInputElement;
	if (fileEl.files) {
		data.append("file", fileEl.files[0]);

		instance.post("/more/upload", data);
	}
});
