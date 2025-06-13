import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

function ChannelList() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    api.get("channels/").then(res => setChannels(res.data));
  }, []);

  return (
    <ul>
      {channels.map(c => (
        <li key={c.id}>
          <Link to={`/chat/${c.id}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ChannelList;
