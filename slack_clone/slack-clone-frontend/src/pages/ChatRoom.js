import { useParams } from "react-router-dom";
import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";

function ChatRoom() {
  const { channelId } = useParams();

  return (
    <div>
      <MessageList channelId={channelId} />
      <MessageInput channelId={channelId} />
    </div>
  );
}

export default ChatRoom;
