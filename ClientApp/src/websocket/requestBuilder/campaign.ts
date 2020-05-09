const type = 'Campaign';

const wrapPayload = (payload: object) =>
    JSON.stringify({ type, payload: JSON.stringify(payload) });

interface createCampaignProps {
    name: string;
    joinable: boolean;
    maxPlayers: number;
    password?: string;
}

const create = (socket: WebSocket) => (payload: createCampaignProps) =>
    socket.send(
        wrapPayload({ type: 'Create', payload: JSON.stringify(payload) })
    );

interface updateCampaignProps {
    ID: number;
    name: string;
    log: string;
    turnIndex: number;
    joinable: boolean;
    maxPlayers: number;
    password?: string;
}

const update = (socket: WebSocket) => (payload: updateCampaignProps) =>
    socket.send(
        wrapPayload({ type: 'Update', payload: JSON.stringify(payload) })
    );

interface JoinCampaignPayload {
    campaignToJoinID: number;
    joiningCharacterID: number;
    password?: string;
}

const join = (socket: WebSocket) => (payload: JoinCampaignPayload) =>
    socket.send(
        wrapPayload({ type: 'JoinCampaign', payload: JSON.stringify(payload) })
    );

const getJoinable = (socket: WebSocket) => () =>
    socket.send(wrapPayload({ type: 'getJoinable' }));

export default (socket: WebSocket) => ({
    create: create(socket),
    update: update(socket),
    join: join(socket),
    getJoinable: getJoinable(socket),
});
