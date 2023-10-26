import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; // Replace with your server URL

const socket = socketIOClient(ENDPOINT);

export default socket;
