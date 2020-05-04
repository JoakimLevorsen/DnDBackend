export class Campaign {
    public campaignName: string;
    public players = [];
    public maxPlayers: number;
    public characterName: string;

    constructor(
        campaignName: string,
        players = [],
        maxPlayers: number,
        characterName: string
    ) {
        this.campaignName = campaignName;
        this.players = players;
        this.maxPlayers = maxPlayers;
        this.characterName = characterName;
    }
}
