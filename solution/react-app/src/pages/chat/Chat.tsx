import {FC} from "react";
import StatefulChat from "./StatefulChat";

const Chat: FC = () => {
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#18191a",
            display: "flex",
        }}>
            <StatefulChat />
        </div>
    )
}

export default Chat;