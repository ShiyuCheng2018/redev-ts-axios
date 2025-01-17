import axios from "../../src/index";
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
