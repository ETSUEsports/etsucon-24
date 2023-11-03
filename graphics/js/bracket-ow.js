const bracketOW = nodecg.Replicant('bracketOW');

// Listen for changes to the bracket.
bracketOW.on('change', (newVal) => {
    console.log(newVal);
    let i = 0;
    newVal.items.forEach(item => {
        let localItem = JSON.parse(JSON.stringify(item));
        if (localItem.team1.name == "DEFAULT_TEAM_1") {
            const [previousTopMatch, previousBottomMatch] = getPreviousMatches(i);
            if (previousTopMatch) {
                localItem.team1.name = `Match ${previousTopMatch} Winner`;
                localItem.team1.logo = '/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png'
            } else {
                localItem.team1.name = "TBD";
                localItem.team1.logo = '/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png'
            }
            if (previousBottomMatch) {
                localItem.team2.name = `Match ${previousBottomMatch} Winner`;
                localItem.team2.logo = '/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png'
            } else { 
                localItem.team2.name = "TBD";
                localItem.team2.logo = '/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png'
            }
        }
        console.log(localItem);
        $(`#m${i}-t1-color`).css('background-color', localItem.team1.color);
        $(`#m${i}-t1-logo`).attr('src', localItem.team1.logo);
        $(`#m${i}-t1-name`).text(localItem.team1.name);
        $(`#m${i}-t1-score`).text(localItem.team1.score);
        $(`#m${i}-t2-color`).css('background-color', localItem.team2.color);
        $(`#m${i}-t2-logo`).attr('src', localItem.team2.logo);
        $(`#m${i}-t2-name`).text(localItem.team2.name);
        $(`#m${i}-t2-score`).text(localItem.team2.score);
        i++;
    });

    $("#winner-logo").attr('src', '/bundles/etsucon-24/graphics/img/bracket-ow/unknown-black.png');
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