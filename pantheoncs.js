Details = new Mongo.Collection('players');


if (Meteor.isClient) {
    Meteor.subscribe('playerdata');
    //Meteor.call('remove');
    Template.playerboard.helpers({
        'player': function () {
            return Details.find({}, {sort: {name: 1} });
        },
        'count': function () {
            return Details.find({selected : 1}).count();
        },
        'checked': function () {
            var isSelected = this.selected;
            if (isSelected == 1) {
                return "checked";
            } else {
                return "";
            }
        }

    });

    Template.teams.helpers({
        'teamCT': function () {
            return Details.find({team: 'CT', selected: 1}, {sort: {name: 1} })
        },
        'teamT': function () {
            return Details.find({team: 'T', selected: 1}, {sort: {name: 1} })
        }

    });

    Template.playerboard.events(
        {
            'change [type=checkbox]': function () {
                var x = this.name;
                var y = this.selected;
                if (y == 0) {
                    Meteor.call('selectplayer', x, 1)
                }
                else {
                    Meteor.call('selectplayer', x, 0)
                }
            }

        }
    );

    Template.teams.events({
        'click .getteams': function () {
            //code for pool A
            var poolAsel = Details.find({selected: 1, pool: 'A'});
            var i = 0;
            var poolA = []
            poolAsel.forEach(function (player) {
                poolA[i++] = player.name
            });
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            var j = 0;
            CT = []
            var number = poolA.length
            for (i = 0; i < number / 2; i++) {
                var x = getRandomInt(0, poolA.length - 1);
                Meteor.call('assignteamCT', poolA[x]);
                CT[j++] = poolA[x];
                poolA.splice(x, 1);
            }
            for (i = 0; i < poolA.length; i++) {
                Meteor.call('assignteamT', poolA[i]);
            }
            //code for pool B
            var poolBsel = Details.find({selected: 1, pool: 'B'});
            i = 0;
            var poolB = []
            poolBsel.forEach(function (player) {
                poolB[i++] = player.name
            });
            j = 0;
            T = []
            number = poolB.length
            for (i = 0; i < number / 2; i++) {
                x = getRandomInt(0, poolB.length - 1);
                Meteor.call('assignteamT', poolB[x]);
                T[j++] = poolB[x];
                poolB.splice(x, 1);
            }
            for (i = 0; i < poolB.length; i++) {
                Meteor.call('assignteamCT', poolB[i]);
            }
            console.log(poolB);
            console.log(T);
        }
    });


}


if (Meteor.isServer) {

    Meteor.startup(function () {
        // code to run on server at startup
        var playerinfobootstraped = [
            {
                'name': 'Gera  (Lund)',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Col. Armaan  (Jatta)',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Shaktimaan  (Chucha)',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Shaggy  (Nut)',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'PaashaBhai',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Kraken  (billa)',
                'Pool': 'A',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Silver bullet  (God)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Aris  (Rand)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Oolala  (deeplund)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Akola  (Kali Tatti)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Blackshark  (Boobi)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Ronin  (Agent)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Elon musk  (Gyaandu)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Dbrox  (Bhaunt)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            },
            {
                'name': 'Chintu  (Chinchoot)',
                'Pool': 'B',
                'Selected': 0,
                'Team': 'NA'
            }
        ];
        Details.remove({});
        if (Details.find().count() == 0) {
            playerinfobootstraped.forEach(function (player) {
                Details.insert({
                    name: player.name,
                    pool: player.Pool, selected: player.Selected, team: player.Team
                });
            });
        }

    });

    Meteor.publish('playerdata', function () {
        return Details.find()
    });

    Meteor.methods({
        'selectplayer': function (selectedplayer, bool) {
            Details.update({name: selectedplayer}, {$set: {selected: bool}})
        },
        'random': function (selectedpoolA) {
            var numberOfSelectedPoolAPlayers = selectedpoolA.length;
            console.log(numberOfSelectedPoolAPlayers);
        },
        'remove': function () {
            Details.update({}, {$set: {selected: 0, team: 'NA'}}, {multi: true});
        },
        'assignteamCT': function (selectedplayer) {
            Details.update({name: selectedplayer}, {$set: {team: 'CT'}})
        },
        'assignteamT': function (selectedplayer) {
            Details.update({name: selectedplayer}, {$set: {team: 'T'}})
        }
    });


}