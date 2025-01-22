import { UnlockRequirement, Avatar } from "types/types";

export const avatars: Avatar[] = [
    { name: 'rock1', image:'rock1', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:1}},
    { name: 'paper1', image:'paper1', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:1}},
    { name: 'scissors1', image:'scissors1', type: 's', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:1}},
    
    { name: 'rocky', image:'rock-sprite', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'tourneysPlayed', amount:1}},
    { name: 'papo', image:'paper-sprite', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'tourneysPlayed', amount:1}},
    { name: 'scizzy', image:'scissors-sprite', type: 's', unlockRequirement: {unlockType: 'amount', field: 'tourneysPlayed', amount:1}},
    
    { name: 'rockwin', image:'rockW', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:10}},
    { name: 'papwin', image:'paperW', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:10}},
    { name: 'scizzwin', image:'scissorsW', type: 's', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:10}},
    
    { name: 'rock 100', image:'rock100', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:100}},
    { name: 'paper 100', image:'paper100', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:100}},
    { name: 'scissors 100', image:'scissors100', type: 's', unlockRequirement: {unlockType: 'amount', field: 'thrown', amount:100}},

    { name: 'stonewall jackson', image:'stonewall', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'gamesWon', amount:50}},
    { name: 'paper pusher', image:'paper3', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'tournamentsPlayed', amount:10}},
    { name: 'shuriken', image:'scissors2', type: 's', unlockRequirement: {unlockType: 'percentage', field: 'thrown', amount:.4}},

    { name: 'rocKing horse', image:'rockingHorse', type: 'r', unlockRequirement: {unlockType: 'amount', field: 'tourneyWon', amount:1}},
    { name: 'paper airplane', image:'paperAirplane', type: 'p', unlockRequirement: {unlockType: 'amount', field: 'tourneyWon', amount:1}},
    { name: 'the mayor', image:'scissorKing', type: 's', unlockRequirement: {unlockType: 'amount', field: 'tourneyWon', amount:1}},

    { name: 'rock star', image:'rockStar', type: 'r', unlockRequirement: {unlockType: 'pay', field: '$', amount:.99}},

    { name: 'clips', image:'barberGold', type: 's', unlockRequirement: {unlockType: 'pay', field: '$', amount:.99}},

    { name: 'paper chasin', image:'paperChasin', type: 'p', unlockRequirement: {unlockType: 'pay', field: '$', amount:1}},


    { name: '"The"', image:'theRock', type: 'r', unlockRequirement: {unlockType: 'pay', field: '$', amount:999}},



    //1 tourney won generic
    
    //the rock - cash
    //stonewall jackson - 50 games won
    //rockKing Horse -tourney won rock

    //$bills - cash
    //paper pusher - 10 tournaments played
    //paper airplane with a crown - tourney won paper

    //ninja scissors - 40% scissors percentage
    //golden barber scissors - cash
    //ribbon cutters - tourney won scissors

]