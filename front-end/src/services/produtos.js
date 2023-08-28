import axios from "axios";
const baseUrl = "http://localhost:3000/api/produtos/";

// eslint-disable-next-line no-unused-vars
let token = null;

function setToken(newToken) {
  token = `Bearer ${newToken}`;
}

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};


export default {getAll, setToken}
