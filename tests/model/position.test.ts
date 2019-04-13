import {Position} from '../../model';


let testPosition: FFB.Protocol.Messages.PositionType = {
    agility: 1,
    armour: 1,
    cost: 1,
    displayName: "",
    movement: 1,
    nrOfIcons: 1,
    playerGender: "",
    playerType: "",
    positionId: "",
    positionName: "",
    quantity: 1,
    race: "",
    shorthand: "",
    skillArray: [],
    skillCategoriesDouble: [],
    skillCategoriesNormal: [],
    skillValues: [],
    strength: 1,
    teamWithPositionId: "",
    thrall: false,
    undead: false,
    urlIconSet: "iconSetUrl",
    urlPortrait: "portraitUrl"
};

describe('Position', () => {
    let position = new Position(testPosition);

    describe('getAssets should', () => {
        let assets = position.getAssets();

        test('exist', () => {
            expect(assets).not.toBeNull();
        });

        test('return portrait url in graphics ', () => {
            expect(assets.graphics).toEqual([testPosition.urlPortrait]);
        });

        test('return icon url in sprites ', () => {
            expect(assets.sprites).toEqual([testPosition.urlIconSet]);
        });
    });
});