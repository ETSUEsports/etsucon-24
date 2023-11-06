const bracketSSBU = nodecg.Replicant('bracketSSBU');
let globalTeams = nodecg.Replicant('globalTeams');

// Listen for changes to the bracket.
bracketSSBU.on('change', (newVal) => {
    // console.log(newVal);
    let i = 1;
    newVal.items.forEach(item => {
        // console.log(item);
        let localItem = JSON.parse(JSON.stringify(item));
        if (localItem.team1.name == "DEFAULT_TEAM_1") {
            const [previousTopMatch, previousBottomMatch] = getPreviousMatches(i);
            if (previousTopMatch) {
                localItem.team1.name = `Match ${previousTopMatch} Winner`;
                localItem.team1.logo = '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown.png'
                localItem.team1.score = "-"
            } else {
                localItem.team1.name = "TBD";
                localItem.team1.logo = '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown.png'
                localItem.team1.score = "-"
            }
        } else{
            localItem.team1.logo = `/assets/etsucon-24/global-team-logos/${localItem.team1.logo}`;
        }
        if (localItem.team2.name == "DEFAULT_TEAM_2") {
            const [previousTopMatch, previousBottomMatch] = getPreviousMatches(i);
            if (previousBottomMatch) {
                localItem.team2.name = `Match ${previousBottomMatch} Winner`;
                localItem.team2.logo = '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown.png'
                localItem.team2.score = "-"
            } else {
                localItem.team2.name = "TBD";
                localItem.team2.logo = '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown.png'
                localItem.team2.score = "-"
            }
        } else {
            localItem.team2.logo = `/assets/etsucon-24/global-team-logos/${localItem.team2.logo}`;
        }
        // console.log(localItem);
        // Find the team color from the global teams list.
        nodecg.readReplicant('globalTeams', (globalTeams) => {
            const team1 = globalTeams.find(team => team.name === localItem.team1.name);
            if (team1) {
                localItem.team1.color = team1.color;
            }
        });
        $(`#m${i}-t1-color`).css('background-color', localItem.team1.color);
        // Determine if color is contrasty with color math enough to use white text or black text.
        if (localItem.team1.color.match(/^#(?:[0-9a-f]{3}){1,2}$/i)) {
            const c = localItem.team1.color.substring(1);
            const rgb = parseInt(c, 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b = (rgb >>  0) & 0xff;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (luma < 128) {
                $(`#m${i}-t1-name`).css('color', 'white');
            } else {
                $(`#m${i}-t1-name`).css('color', 'black');
            }
        }
        $(`#m${i}-t1-logo`).attr('src', localItem.team1.logo);
        $(`#m${i}-t1-name`).text(localItem.team1.name);
        $(`#m${i}-t1-score`).text(localItem.team1.score);
        nodecg.readReplicant('globalTeams', (globalTeams) => {
            const team2 = globalTeams.find(team => team.name === localItem.team2.name);
            if (team2) {
                localItem.team2.color = team2.color;
            }
        });
        $(`#m${i}-t2-color`).css('background-color', localItem.team2.color);
        // Determine if color is contrasty with color math enough to use white text or black text.
        if (localItem.team2.color.match(/^#(?:[0-9a-f]{3}){1,2}$/i)) {
            const c = localItem.team2.color.substring(1);
            const rgb = parseInt(c, 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b = (rgb >>  0) & 0xff;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (luma < 128) {
                $(`#m${i}-t2-name`).css('color', 'white');
            } else {
                $(`#m${i}-t2-name`).css('color', 'black');
            }
        }
        $(`#m${i}-t2-logo`).attr('src', localItem.team2.logo);
        $(`#m${i}-t2-name`).text(localItem.team2.name);
        $(`#m${i}-t2-score`).text(localItem.team2.score);
        i++;
    });

    // $("#winner-logo").attr('src', '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown-black.png');

    if (newVal.winner.name != "NO_TEAM") {
        // // console.log(newVal.winner)
        $("#winner-logo").attr('src', `/assets/etsucon-24/global-team-logos/${newVal.winner.logo}`);
        $(".b-row-winner").css('background-color', newVal.winner.color);
    } else {
        $(".b-row-winner").css('background-color', '#bbbbbb');
        $("#winner-logo").attr('src', '/bundles/etsucon-24/graphics/img/bracket-ssbu/unknown-black.png');
    }
});


function getPreviousMatches(i) {
    if (i < 1 || i > 7) {
        return [null, null];
    }

    const matchMappings = {
        5: [1, 2],
        6: [3, 4],
        7: [5, 6]
    };

    const previousMatches = matchMappings[i] || [null, null];

    return previousMatches;
}

// Listen for changes to the global teams list.
globalTeams.on('change', newVal => {
    nodecg.readReplicant('bracketSSBU', (bracketSSBU) => {
        let i = 1;
        bracketSSBU.items.forEach(item => {
            let localItem = JSON.parse(JSON.stringify(item));
            const team1 = newVal.find(team => team.name === localItem.team1.name);
            if (team1) {
                localItem.team1.color = team1.color;
            }
            $(`#m${i}-t1-color`).css('background-color', localItem.team1.color);
            const team2 = newVal.find(team => team.name === localItem.team2.name);
            if (team2) {
                localItem.team2.color = team2.color;
            }
            $(`#m${i}-t2-color`).css('background-color', localItem.team2.color);
            i++;
        });
    });
});