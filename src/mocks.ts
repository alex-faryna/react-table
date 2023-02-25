import AxiosMockAdapter from "axios-mock-adapter";
import axios from 'axios';

const mock = new AxiosMockAdapter(axios, { delayResponse: 1200 });

// /students?searchTerm=<student-name>&limit=20&skip=20 HTTP/1.1

/*mock.onGet("/students").reply(200, {
    users: [{ id: 1, name: "John Smith" }],
});*/

console.log("ok");

mock.onGet("/students").reply(config => {
    console.log(config);
    return [200, {}];
});

export default axios;