const type = 'Character';

const wrapPayload = (payload: object) =>
    JSON.stringify({ type, payload: JSON.stringify(payload) });

interface createCharacterProps {
    name: string;
    race: string;
    characterClass: string;
}

const create = (socket: WebSocket) => (payload: createCharacterProps) =>
    socket.send(
        wrapPayload({
            type: 'Create',
            payload: JSON.stringify(payload),
        })
    );

// We cannot declare the constant as 'delete' since it's reserved
const deleteC = (socket: WebSocket) => (id: string) =>
    socket.send(wrapPayload({ type: 'Delete', payload: id }));

interface updateNameProps {
    ID: number;
    name: string;
}

const updateName = (socket: WebSocket) => (payload: updateNameProps) =>
    socket.send(
        wrapPayload({ type: 'Update', payload: JSON.stringify(payload) })
    );

interface updateStatsProps {
    ID: number;
    xp?: number;
    health?: number;
}

const updateStats = (socket: WebSocket) => (payload: updateStatsProps) =>
    socket.send(
        wrapPayload({ type: 'Update', payload: JSON.stringify(payload) })
    );

export default (socket: WebSocket) => ({
    create: create(socket),
    delete: deleteC(socket),
    updateName: updateName(socket),
    updateStats: updateStats(socket),
});
