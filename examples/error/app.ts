import axios, { AxiosError } from "../../src/index";

axios({
	method: "get",
	url: "/error/get1",
})
	.then((res) => {
		console.log(res);
	})
	.catch((e: AxiosError) => {
		console.log(e.message);
		console.log(e.config);
		console.log(e.code);
		console.log(e.request);
		console.log(e.isAxiosError);
	});

axios({
	method: "get",
	url: "/error/get",
})
	.then((res) => {
		console.log(res);
	})
	.catch((e: AxiosError) => {
		console.log(e.message);
		console.log(e.config);
		console.log(e.code);
		console.log(e.request);
		console.log(e.isAxiosError);
	});

setTimeout(() => {
	axios({
		method: "get",
		url: "/error/get",
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e: AxiosError) => {
			console.log(e.message);
			console.log(e.config);
			console.log(e.code);
			console.log(e.request);
			console.log(e.isAxiosError);
		});
}, 5000);

axios({
	method: "get",
	url: "/error/timeout",
	timeOut: 2000,
})
	.then((res) => {
		console.log(res);
	})
	.catch((e: AxiosError) => {
		console.log(e.message);
		console.log(e.config);
		console.log(e.code);
		console.log(e.request);
		console.log(e.isAxiosError);
	});
