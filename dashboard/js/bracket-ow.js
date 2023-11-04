const bracketOW = nodecg.Replicant('bracketOW');
const owTeams = nodecg.Replicant('owTeams');

// Listen for changes to the bracket.
bracketOW.on('change', (newVal) => {
    console.log(newVal);
    // Update forms with current data.
    for (let i = 1; i < 8; i++) {
        // Set the select option to the current team.
        $(`#m${i}-t1-name`).val(newVal.items[i - 1].team1.name);
        $(`#m${i}-t2-name`).val(newVal.items[i - 1].team2.name);
        $(`#m${i}-t1-score`).val(newVal.items[i - 1].team1.score);
        $(`#m${i}-t2-score`).val(newVal.items[i - 1].team2.score);
    }
    $('#gc-t1-name').val(newVal.winner.name);
    $('#gc-t1-score').val(newVal.winner.score);
});

$("#resetBracketOW").click(() => {
    nodecg.sendMessage('bracketOWReset');
});

owTeams.on('change', (newVal) => {
    console.log(newVal);
    for (let i = 1; i < 8; i++) {
        $(`#m${i}-t1-name`).empty();
        $(`#m${i}-t2-name`).empty();
        $('#gc-t1-name').empty();
        $(`#m${i}-t1-name`).append(`<option value="DEFAULT_TEAM_1" selected disabled">Select Team</option>`);
        $(`#m${i}-t2-name`).append(`<option value="DEFAULT_TEAM_2" selected disabled">Select Team</option>`);
        $('#gc-t1-name').append(`<option value="NO_TEAM" selected">Select Team</option>`);
        for (let j = 0; j < newVal.length; j++) {
            $(`#m${i}-t1-name`).append(`<option value="${newVal[j].name}">${newVal[j].name}</option>`);
            $(`#m${i}-t2-name`).append(`<option value="${newVal[j].name}">${newVal[j].name}</option>`);
            $('#gc-t1-name').append(`<option value="${newVal[j].name}">${newVal[j].name}</option>`);
        }
    }
    nodecg.readReplicant('bracketOW', (data, err) => {
        if (err) {
            console.error(err);
        }
        console.log(data);
        for (let i = 1; i < 8; i++) {
            $(`#m${i}-t1-name`).val(data.items[i - 1].team1.name);
            $(`#m${i}-t2-name`).val(data.items[i - 1].team2.name);
        }
        $('#gc-t1-name').val(data.winner.name);
        $('#gc-t1-score').val(data.winner.score);
    });
});

$("#submitBracketOW").click(() => {
    // Validate the data.
    // Rules:
    // 1. The same team cannot be selected twice in the same match.
    // 2. The same team cannot be selected twice in the same round.
    // 3. Score must be a number between 0 and 9.

    // Get the data.
    let matches = [];
    for (let i = 1; i < 8; i++) {
        let match = {
            team1: $(`#m${i}-t1-name`).val(),
            team2: $(`#m${i}-t2-name`).val(),
            score1: $(`#m${i}-t1-score`).val(),
            score2: $(`#m${i}-t2-score`).val()
        };
        matches.push(match);
    }

    // Validate the data.
    let errors = [];
    for (let i = 0; i < matches.length; i++) {
        // Check for duplicate teams in the same match.
        if (matches[i].team1 == matches[i].team2) {
            errors.push(`Match ${i + 1} has the same team selected twice.`);
        }

        // Check for invalid scores.
        if (matches[i].score1 < 0 || matches[i].score1 > 9) {
            errors.push(`Score 1 in match ${i + 1} is invalid.`);
        }
        if (matches[i].score2 < 0 || matches[i].score2 > 9) {
            errors.push(`Score 2 in match ${i + 1} is invalid.`);
        }
    }

    // Display the errors.
    if (errors.length > 0) {
        let errorString = "";
        for (let i = 0; i < errors.length; i++) {
            errorString += `${errors[i]}\n`;
        }
        alert(errorString);
        return;
    }

    const localTeams = JSON.parse(JSON.stringify(owTeams.value));

    localTeams.push({
        "name": "DEFAULT_TEAM_1",
        "logo": "/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png",
        "color": "#bbbbbb"
    });

    localTeams.push({
        "name": "DEFAULT_TEAM_2",
        "logo": "/bundles/etsucon-24/graphics/img/bracket-ow/unknown.png",
        "color": "#bbbbbb"
    });

    const transformedData = {
        "name": "Bracket",
        "items": matches.map((item) => {
            const team1 = localTeams.find((team) => team.name === item.team1);
            const team2 = localTeams.find((team) => team.name === item.team2);
            // Find winner based on score if none then "none"
            let winner = "none";
            if (item.score1 > item.score2) {
                winner = item.team1;
            } else if (item.score2 > item.score1) {
                winner = item.team2;
            }
            return {
                "team1": {
                    "name": team1.name,
                    "score": item.score1,
                    "color": team1.color,
                    "logo": team1.logo,
                },
                "team2": {
                    "name": team2.name,
                    "score": item.score2,
                    "color": team2.color,
                    "logo": team2.logo,
                },
                "winner": winner
            };
        })
    };

    let winner = {name: "NO_TEAM", score: 0, color: '#bbbbbb', logo: ''};
    winner.name = $('#gc-t1-name').val();
    if(winner.name != "NO_TEAM") {
        winner.logo = localTeams.find((team) => team.name === winner.name).logo;
        winner.color = localTeams.find((team) => team.name === winner.name).color;
        winner.score = $('#gc-t1-score').val();
    } else {
        winner.logo = "/bundles/etsucon-24/graphics/img/bracket-ow/unknown-black.png";
        winner.color = "#bbbbbb";
        winner.score = 0;
    }

    transformedData.winner = winner;

    console.log(transformedData)

    bracketOW.value = transformedData;
});