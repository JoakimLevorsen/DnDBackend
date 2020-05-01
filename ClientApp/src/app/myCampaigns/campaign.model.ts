export class Campaign {
    public campaignName: string;
    public players = [];
    public characterName: string;

    constructor(campaignName: string, players = [], characterName: string) {
        this.campaignName = campaignName;
        this.players = players;
        this.characterName = characterName;
    }
}
