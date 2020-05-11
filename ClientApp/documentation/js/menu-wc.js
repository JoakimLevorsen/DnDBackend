'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">d_d_backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppMaterialModule.html" data-type="entity-link">AppMaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' : 'data-target="#xs-components-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' :
                                            'id="xs-components-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateCharacterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateCharacterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponentDialog.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponentDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyCampaignsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyCampaignsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyCharactersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyCharactersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewCampaignComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewCampaignComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlayComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' : 'data-target="#xs-injectables-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' :
                                        'id="xs-injectables-links-module-AppModule-1a2be1c89a0e18be002f1249af98b44e"' }>
                                        <li class="link">
                                            <a href="injectables/WebSocketService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebSocketService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppServerModule.html" data-type="entity-link">AppServerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppServerModule-28b0b55c62ad7b5fcaffe658b46fa8e7"' : 'data-target="#xs-components-links-module-AppServerModule-28b0b55c62ad7b5fcaffe658b46fa8e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppServerModule-28b0b55c62ad7b5fcaffe658b46fa8e7"' :
                                            'id="xs-components-links-module-AppServerModule-28b0b55c62ad7b5fcaffe658b46fa8e7"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Character.html" data-type="entity-link">Character</a>
                            </li>
                            <li class="link">
                                <a href="classes/Editable.html" data-type="entity-link">Editable</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/WebSocketService.html" data-type="entity-link">WebSocketService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuardService.html" data-type="entity-link">AuthGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Campaign.html" data-type="entity-link">Campaign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/createCampaignProps.html" data-type="entity-link">createCampaignProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/createCharacterProps.html" data-type="entity-link">createCharacterProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DiceRoll.html" data-type="entity-link">DiceRoll</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/diceRollPayload.html" data-type="entity-link">diceRollPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GameState.html" data-type="entity-link">GameState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GameStateCampaign.html" data-type="entity-link">GameStateCampaign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JoinCampaignPayload.html" data-type="entity-link">JoinCampaignPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginInfo.html" data-type="entity-link">LoginInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateCampaignProps.html" data-type="entity-link">updateCampaignProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateNameProps.html" data-type="entity-link">updateNameProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateStatsProps.html" data-type="entity-link">updateStatsProps</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});