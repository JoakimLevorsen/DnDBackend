interface createCharacterProps {
    name: string;
    class: string;
    race: string;
}

const type = "Character";

const create = (socket: WebSocket) => (props: createCharacterProps) =>
    socket.send(
        JSON.stringify({
            type,
            payload: JSON.stringify({
                type: "Create",
                payload: JSON.stringify(props),
            }),
        })
    );

export default (socket: WebSocket) => ({ create: create(socket) });
