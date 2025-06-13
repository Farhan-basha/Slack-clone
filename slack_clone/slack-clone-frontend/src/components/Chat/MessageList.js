import { useEffect, useState } from "react";
import api from "../../api";

function MessageList({ channelId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get(`channels/${channelId}/messages/`).then(res => setMessages(res.data));
  }, [channelId]);

  return (
    <div>
      {messages.map(m => (
        <p key={m.id}><b>{m.sender}</b>: {m.text}</p>
      ))}
    </div>
  );
}

export default MessageList;
