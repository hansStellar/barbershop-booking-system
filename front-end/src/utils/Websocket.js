
export function Websocket(onUpdate) {
  let socket; // Live communication between front and back

  // Function that handles the entire connection of the socket
  function connect() { 
    socket = new WebSocket("ws://localhost:8000/ws/");

    // ! Socket Events

    // ? Event on opening the connection
    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
    };

    // ? Event on receiving a message from the server/back-end
    socket.onmessage = (event) => { // This is an event that runs every time the websocket receives a message from the server
      if (event.data === "update") {
        if (typeof onUpdate === "function") {
          onUpdate(); // trigger the callback passed in
        }
      }
    };

    // ? Event on closing the socket/browser/connection
    socket.onclose = () => {
      console.warn("🔌 WebSocket disconnected, reconnecting...");
      setTimeout(connect, 3000); // Reconnect after 3s
    };

    // ? Event on receiving an error from the server/connection
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      socket.close();
    };
  }

  connect();

  return () => socket.close(); // This ONLY runs on unmount
}