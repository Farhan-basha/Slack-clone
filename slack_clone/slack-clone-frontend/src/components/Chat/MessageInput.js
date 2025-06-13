import { useState } from "react";
import api from "../../api";

function MessageInput({ channelId }) {
  const [text, setText] = useState("");

  const sendMessage = async e => {
    e.preventDefault();
    await api.post(`channels/${channelId}/messages/`, { text });
    setText("");
  };

  return (
    <form onSubmit={sendMessage}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;
