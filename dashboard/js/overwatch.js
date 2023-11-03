// Setup replicants
const owLeftTeam = nodecg.Replicant('owLeftTeam');
const owRightTeam = nodecg.Replicant('owRightTeam');
const owMatchStats = nodecg.Replicant('owMatchStats');
const owTeams = nodecg.Replicant('owTeams');
let controlMaps = [];
let escortMaps = [];
let flashMaps = [];
let hybridMaps = [];
let pushMaps = [];

// On replicant change, update the DOM using jQuery.
owLeftTeam.on('change', newVal => {
    $('#leftName').val(newVal.name);
    $('#leftLogo').val(newVal.logo);
    $('#leftScore').val(newVal.score);
    $('#leftColor').val(newVal.color);
});

owRightTeam.on('change', newVal => {
    $('#rightName').val(newVal.name);
    $('#rightLogo').val(newVal.logo);
    $('#rightScore').val(newVal.score);
    $('#rightColor').val(newVal.color);
});

owMatchStats.on('change', newVal => {
    $('#matchMapNum').val(newVal.currentMap);
    $('#matchBO').val(newVal.bestOf);
    $('#matchMode').val(newVal.mode);
    console.log(newVal.attacker);
    if (newVal.attacker == "left") {
        $('#attackerRadio1').prop('checked', true);
    } else {
        $('#attackerRadio2').prop('checked', true);
    }
    console.log(newVal)
    newVal.maps.forEach(map => {
        $(`#map${map.map}tba`).prop('checked', map.tba);
        $(`#map${map.map}inprogress`).prop('checked', map.inprogress);
        $(`#map${map.map}mode`).val(map.mode);
        $(`#map${map.map}selection`).val(map.name);
        $(`#map${map.map}leftScore`).val(map.leftScore);
        $(`#map${map.map}rightScore`).val(map.rightScore);
        $(`#map${map.map}winner`).val(map.winningTeam);
    });
});

owTeams.on('change', newVal => {
    $('#teamList').empty();
    newVal.forEach(team => {
        const card = `<div class="card card-team" style="width: 18rem;">
        <div class="card-body">
        <div class="row">
        <div class="col-6">
        <img src="/assets/etsucon-24/ow-team-logos/${team.logo}" class="card-img-top card-team-logo">
        </div>
        <div class="col-6">
        <h5 class="card-title">${team.name}</h5>
        </div>
        </div>
        <button type="button" onclick="setLeftTeam('${team.name}');" class="btn btn-danger">Left</button> <button class="btn btn-primary" type="button" onclick="setRightTeam('${team.name}');">Right</button>
        </div>
        </div>`;
        $('#teamList').append(card);
    });
});

// When #reset is clicked, send a message to the extension to reset the replicants.
$('#resetReplicants').click(() => {
    nodecg.sendMessage('owReset');
});

$('#deleteAllTeams').click(() => {
    nodecg.sendMessage('owDeleteAllTeams');
});


$('#updateReplicants').click(() => {
    // Verify data first, here are the rules:
    // 1. Name cannot be empty.
    // 2. Score must be a number between 0 and 9.
    // 3. Logo must be a valid .png (can include path or HTTP URL).
    // 4. Color must be a valid hex code.
    // 6. There must be an attacker selected.
    // 7. currentMap must be a number between 1 and 5.
    // 8. bestOf must be a number between 1 and 5.
    // 9. A map cannot be in progress and TBA at the same time.
    // 10. Multiple maps cannot be in progress at the same time.
    // 11. A map must have a winner if it is not in progress or TBA.
    // 12. A map must have a score if it is not in progress or TBA.
    // 13. A map must have a mode.
    // 14. A map must have a selection if not TBA


    // Check all rules
    let errors = [];
    // Rule 1
    if ($('#leftName').val() == "") {
        errors.push("Left team name cannot be empty.");
    }
    if ($('#rightName').val() == "") {
        errors.push("Right team name cannot be empty.");
    }
    // Rule 2
    if ($('#leftScore').val() < 0 || $('#leftScore').val() > 9) {
        errors.push("Left team score must be between 0 and 9.");
    }
    if ($('#rightScore').val() < 0 || $('#rightScore').val() > 9) {
        errors.push("Right team score must be between 0 and 9.");
    }
    // Rule 3
    if (!($('#leftLogo').val().endsWith('.png') || $('#leftLogo').val().startsWith('http'))) {
        errors.push("Left team logo must be a valid .png file or HTTP URL.");
    }
    if (!($('#rightLogo').val().endsWith('.png') || $('#rightLogo').val().startsWith('http'))) {
        errors.push("Right team logo must be a valid .png file or HTTP URL.");
    }
    // Rule 4
    if (!($('#leftColor').val().startsWith('#') && $('#leftColor').val().length == 7)) {
        errors.push("Left team color must be a valid hex code.");
    }
    if (!($('#rightColor').val().startsWith('#') && $('#rightColor').val().length == 7)) {
        errors.push("Right team color must be a valid hex code.");
    }
    // Rule 6
    if ($('input[name=attackerRadio]:checked').val() == undefined) {
        errors.push("You must select an attacker.");
    }
    // Rule 7
    if ($('#matchMapNum').val() < 1 || $('#matchMapNum').val() > 5) {
        errors.push("Current map must be between 1 and 5.");
    }
    // Rule 8
    if ($('#matchBO').val() < 1 || $('#matchBO').val() > 5) {
        errors.push("Best of must be between 1 and 5.");
    }
    // Rule 9
    if ($(`#map1tba`).is(":checked") && $(`#map1inprogress`).is(":checked")) {
        errors.push("Map 1 cannot be in progress and TBA at the same time.");
    }
    if ($(`#map2tba`).is(":checked") && $(`#map2inprogress`).is(":checked")) {
        errors.push("Map 2 cannot be in progress and TBA at the same time.");
    }
    if ($(`#map3tba`).is(":checked") && $(`#map3inprogress`).is(":checked")) {
        errors.push("Map 3 cannot be in progress and TBA at the same time.");
    }
    if ($(`#map4tba`).is(":checked") && $(`#map4inprogress`).is(":checked")) {
        errors.push("Map 4 cannot be in progress and TBA at the same time.");
    }
    if ($(`#map5tba`).is(":checked") && $(`#map5inprogress`).is(":checked")) {
        errors.push("Map 5 cannot be in progress and TBA at the same time.");
    }
    // Rule 10
    if ($(`#map1inprogress`).is(":checked") && $(`#map2inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map1inprogress`).is(":checked") && $(`#map3inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map1inprogress`).is(":checked") && $(`#map4inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map1inprogress`).is(":checked") && $(`#map5inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map2inprogress`).is(":checked") && $(`#map3inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map2inprogress`).is(":checked") && $(`#map4inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map2inprogress`).is(":checked") && $(`#map5inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map3inprogress`).is(":checked") && $(`#map4inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map3inprogress`).is(":checked") && $(`#map5inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    if ($(`#map4inprogress`).is(":checked") && $(`#map5inprogress`).is(":checked")) {
        errors.push("Only one map can be in progress at a time.");
    }
    // Rule 11
    if (!$(`#map1tba`).is(":checked") && !$(`#map1inprogress`).is(":checked") && $(`#map1winner`).val() == "none") {
        errors.push("Map 1 must have a winner if it is not in progress or TBA.");
    }
    if (!$(`#map2tba`).is(":checked") && !$(`#map2inprogress`).is(":checked") && $(`#map2winner`).val() == "none") {
        errors.push("Map 2 must have a winner if it is not in progress or TBA.");
    }
    if (!$(`#map3tba`).is(":checked") && !$(`#map3inprogress`).is(":checked") && $(`#map3winner`).val() == "none") {
        errors.push("Map 3 must have a winner if it is not in progress or TBA.");
    }
    if (!$(`#map4tba`).is(":checked") && !$(`#map4inprogress`).is(":checked") && $(`#map4winner`).val() == "none") {
        errors.push("Map 4 must have a winner if it is not in progress or TBA.");
    }
    if (!$(`#map5tba`).is(":checked") && !$(`#map5inprogress`).is(":checked") && $(`#map5winner`).val() == "none") {
        errors.push("Map 5 must have a winner if it is not in progress or TBA.");
    }
    // Rule 12
    if (!$(`#map1tba`).is(":checked") && !$(`#map1inprogress`).is(":checked") && $(`#map1leftScore`).val() == "") {
        errors.push("Map 1 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map1tba`).is(":checked") && !$(`#map1inprogress`).is(":checked") && $(`#map1rightScore`).val() == "") {
        errors.push("Map 1 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map2tba`).is(":checked") && !$(`#map2inprogress`).is(":checked") && $(`#map2leftScore`).val() == "") {
        errors.push("Map 2 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map2tba`).is(":checked") && !$(`#map2inprogress`).is(":checked") && $(`#map2rightScore`).val() == "") {
        errors.push("Map 2 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map3tba`).is(":checked") && !$(`#map3inprogress`).is(":checked") && $(`#map3leftScore`).val() == "") {
        errors.push("Map 3 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map3tba`).is(":checked") && !$(`#map3inprogress`).is(":checked") && $(`#map3rightScore`).val() == "") {
        errors.push("Map 3 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map4tba`).is(":checked") && !$(`#map4inprogress`).is(":checked") && $(`#map4leftScore`).val() == "") {
        errors.push("Map 4 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map4tba`).is(":checked") && !$(`#map4inprogress`).is(":checked") && $(`#map4rightScore`).val() == "") {
        errors.push("Map 4 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map5tba`).is(":checked") && !$(`#map5inprogress`).is(":checked") && $(`#map5leftScore`).val() == "") {
        errors.push("Map 5 must have a score if it is not in progress or TBA.");
    }
    if (!$(`#map5tba`).is(":checked") && !$(`#map5inprogress`).is(":checked") && $(`#map5rightScore`).val() == "") {
        errors.push("Map 5 must have a score if it is not in progress or TBA.");
    }
    // Rule 13
    if ($(`#map1mode`).val() == "none") {
        errors.push("Map 1 must have a mode.");
    }
    if ($(`#map2mode`).val() == "none") {
        errors.push("Map 2 must have a mode.");
    }
    if ($(`#map3mode`).val() == "none") {
        errors.push("Map 3 must have a mode.");
    }
    if ($(`#map4mode`).val() == "none") {
        errors.push("Map 4 must have a mode.");
    }
    if ($(`#map5mode`).val() == "none") {
        errors.push("Map 5 must have a mode.");
    }
    // Rule 14
    if ($(`#map1selection`).val() == "none" && !$(`#map1tba`).is(":checked")) {
        errors.push("Map 1 must have a selection if not TBA.");
    }
    if ($(`#map2selection`).val() == "none" && !$(`#map2tba`).is(":checked")) {
        errors.push("Map 2 must have a selection if not TBA.");
    }
    if ($(`#map3selection`).val() == "none" && !$(`#map3tba`).is(":checked")) {
        errors.push("Map 3 must have a selection if not TBA.");
    }
    if ($(`#map4selection`).val() == "none" && !$(`#map4tba`).is(":checked")) {
        errors.push("Map 4 must have a selection if not TBA.");
    }
    if ($(`#map5selection`).val() == "none" && !$(`#map5tba`).is(":checked")) {
        errors.push("Map 5 must have a selection if not TBA.");
    }

    // If there are errors, display them and return.
    if (errors.length > 0) {
        let errorString = "";
        errors.forEach(error => {
            errorString += `${error}<br>`;
        });
        $('#errorModalBody').html(errorString);
        $('#errorModal').modal('show');
        return;
    }

    // If there are no errors, update the replicants.
    owLeftTeam.value.name = $('#leftName').val();
    owLeftTeam.value.logo = $('#leftLogo').val();
    owLeftTeam.value.score = $('#leftScore').val();
    owLeftTeam.value.color = $('#leftColor').val();
    owRightTeam.value.name = $('#rightName').val();
    owRightTeam.value.logo = $('#rightLogo').val();
    owRightTeam.value.score = $('#rightScore').val();
    owRightTeam.value.color = $('#rightColor').val();
    owMatchStats.value.currentMap = $('#matchMapNum').val();
    owMatchStats.value.bestOf = $('#matchBO').val();
    // Determine mode from map selection & map number.
    const mapNumber = $('#matchMapNum').val();
    const mapMode = $(`#map${mapNumber}mode`).val();
    owMatchStats.value.mode = mapMode;
    owMatchStats.value.attacker = $('input[name=attackerRadio]:checked').val();
    owMatchStats.value.maps.forEach(map => {
        map.tba = $(`#map${map.map}tba`).is(":checked");
        map.inprogress = $(`#map${map.map}inprogress`).is(":checked");
        map.mode = $(`#map${map.map}mode`).val();
        map.name = $(`#map${map.map}selection`).val();
        map.label = $(`#map${map.map}selection option:selected`).text();
        map.leftScore = $(`#map${map.map}leftScore`).val();
        map.rightScore = $(`#map${map.map}rightScore`).val();
        map.winningTeam = $(`#map${map.map}winner`).val();
    });
});

$('#swapSides').click(() => {
    let leftTeam = owLeftTeam.value;
    let rightTeam = owRightTeam.value;
    owLeftTeam.value = rightTeam;
    owRightTeam.value = leftTeam;
    // Swap winning team for each map.
    owMatchStats.value.maps.forEach(map => {
        if (map.winningTeam == "left") {
            map.winningTeam = "right";
        } else if (map.winningTeam == "right") {
            map.winningTeam = "left";
        }
    });
});

function setLeftTeam(teamName) {
    const team = owTeams.value.find(team => team.name == teamName);
    owLeftTeam.value.name = team.name;
    owLeftTeam.value.logo = `/assets/etsucon-24/ow-team-logos/${team.logo}`;
    owLeftTeam.value.color = team.color;
}

function setRightTeam(teamName) {
    const team = owTeams.value.find(team => team.name == teamName);
    owRightTeam.value.name = team.name;
    owRightTeam.value.logo = `/assets/etsucon-24/ow-team-logos/${team.logo}`;
    owRightTeam.value.color = team.color;
}

$(function() {
    // AJAX to get maps from the server.
    $.get('/etsucon-24/ow/maps', function(data) {
        controlMaps = data.control;
        escortMaps = data.escort;
        flashMaps = data.flash;
        hybridMaps = data.hybrid;
        pushMaps = data.push;
        controlMaps.unshift({name: 'none', label: 'None'});
        escortMaps.unshift({name: 'none', label: 'None'});
        flashMaps.unshift({name: 'none', label: 'None'});
        hybridMaps.unshift({name: 'none', label: 'None'});
        pushMaps.unshift({name: 'none', label: 'None'});

        controlMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });

        hybridMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });

        flashMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });

        pushMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });

        escortMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    });
});

$('#map1mode').change(function() {
    const mode = $(this).val();
    $('#map1selection').empty();
    if (mode == "control") {
        controlMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "escort") {
        escortMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "flash") {
        flashMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "hybrid") {
        hybridMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "push") {
        pushMaps.forEach(map => {
            $('#map1selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    }
});

$('#map2mode').change(function() {
    const mode = $(this).val();
    $('#map2selection').empty();
    if (mode == "control") {
        controlMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "escort") {
        escortMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "flash") {
        flashMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "hybrid") {
        hybridMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "push") {
        pushMaps.forEach(map => {
            $('#map2selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    }
});

$('#map3mode').change(function() {
    const mode = $(this).val();
    $('#map3selection').empty();
    if (mode == "control") {
        controlMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "escort") {
        escortMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "flash") {
        flashMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "hybrid") {
        hybridMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "push") {
        pushMaps.forEach(map => {
            $('#map3selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    }
});

$('#map4mode').change(function() {
    const mode = $(this).val();
    $('#map4selection').empty();
    if (mode == "control") {
        controlMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "escort") {
        escortMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "flash") {
        flashMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "hybrid") {
        hybridMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "push") {
        pushMaps.forEach(map => {
            $('#map4selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    }
});

$('#map5mode').change(function() {
    const mode = $(this).val();
    $('#map5selection').empty();
    if (mode == "control") {
        controlMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "escort") {
        escortMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "flash") {
        flashMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "hybrid") {
        hybridMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    } else if (mode == "push") {
        pushMaps.forEach(map => {
            $('#map5selection').append(`<option value="${map.name}" ${(map.name) == 'none' ? 'disabled selected' : ''}>${map.label}</option>`);
        });
    }
});