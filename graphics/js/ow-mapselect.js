// Initalize replicants
const owLeftTeam = nodecg.Replicant('owLeftTeam');
const owRightTeam = nodecg.Replicant('owRightTeam');
const owMatchStats = nodecg.Replicant('owMatchStats');

owMatchStats.on('change', newVal => {
    console.log(newVal);
    drawMapSelect();
});

owLeftTeam.on('change', newVal => {
    console.log(newVal);
    drawMapSelect();
});

owRightTeam.on('change', newVal => {
    console.log(newVal);
    drawMapSelect();
});

function drawMapSelect(){
    nodecg.readReplicant('owMatchStats', 'etsucon-24', newVal => {
    // Find what map is in progress
    let inProgress = null;
    for(let i = 0; i < newVal.maps.length; i++) {
        if(newVal.maps[i].inprogress) {
            inProgress = newVal.maps[i].map;
        }
    }
    console.log(newVal);
    console.log(`Map in progress: ${inProgress}`);
    if(newVal.maps[0].tba) {
        $('#map1').addClass('tba');
    } else if (newVal.maps[0].inprogress){
        $('#map1').addClass('inprogress');
    } else {
        $('#map1').removeClass('tba');
        $('#map1').removeClass('inprogress');
    }

    if(newVal.maps[1].tba) {
        $('#map2').addClass('tba');
    } else if (newVal.maps[1].inprogress){
        $('#map2').addClass('inprogress');
    } else {
        $('#map2').removeClass('tba');
        $('#map2').removeClass('inprogress');
    }

    if(newVal.maps[2].tba) {
        $('#map3').addClass('tba');
    } else if (newVal.maps[2].inprogress){
        $('#map3').addClass('inprogress');
    } else {
        $('#map3').removeClass('tba');
        $('#map3').removeClass('inprogress');
    }

    if(newVal.maps[3].tba) {
        $('#map4').addClass('tba');
    } else if (newVal.maps[3].inprogress){
        $('#map4').addClass('inprogress');
    } else {
        $('#map4').removeClass('tba');
        $('#map4').removeClass('inprogress');
    }

    if(newVal.maps[4].tba) {
        $('#map5').addClass('tba');
    } else if (newVal.maps[4].inprogress){
        $('#map5').addClass('inprogress');
    } else {
        $('#map5').removeClass('tba');
        $('#map5').removeClass('inprogress');
    }
    
    if(inProgress != null) {
        $(`#map${inProgress}`).removeClass('tba');
        $(`#map${inProgress}`).addClass('inprogress');
        // add hasOtherInProgress class to maps that are not in progress
        for(let i = 1; i <= 5; i++) {
            if(i != inProgress) {
                $(`#map${i}`).addClass('hasOtherInProgress');
            } else {
                $(`#map${i}`).removeClass('hasOtherInProgress');
            }
        }
    } else {
        for(let i = 1; i <= 5; i++) {
            $(`#map${i}`).removeClass('hasOtherInProgress');
        }
    }



    $('#map1winnerLogo').attr('src', newVal.maps[0].winningTeam == 'left' ? owLeftTeam.value.logo : owRightTeam.value.logo);
    $('#map2winnerLogo').attr('src', newVal.maps[1].winningTeam == 'left' ? owLeftTeam.value.logo : owRightTeam.value.logo);
    $('#map3winnerLogo').attr('src', newVal.maps[2].winningTeam == 'left' ? owLeftTeam.value.logo : owRightTeam.value.logo);
    $('#map4winnerLogo').attr('src', newVal.maps[3].winningTeam == 'left' ? owLeftTeam.value.logo : owRightTeam.value.logo);
    $('#map5winnerLogo').attr('src', newVal.maps[4].winningTeam == 'left' ? owLeftTeam.value.logo : owRightTeam.value.logo);

    $('#map1winner').text(newVal.maps[0].winningTeam == 'left' ? owLeftTeam.value.name : owRightTeam.value.name);
    $('#map2winner').text(newVal.maps[1].winningTeam == 'left' ? owLeftTeam.value.name : owRightTeam.value.name);
    $('#map3winner').text(newVal.maps[2].winningTeam == 'left' ? owLeftTeam.value.name : owRightTeam.value.name);
    $('#map4winner').text(newVal.maps[3].winningTeam == 'left' ? owLeftTeam.value.name : owRightTeam.value.name);
    $('#map5winner').text(newVal.maps[4].winningTeam == 'left' ? owLeftTeam.value.name : owRightTeam.value.name);

    $('#map1leftScore').text(newVal.maps[0].leftScore);
    $('#map2leftScore').text(newVal.maps[1].leftScore);
    $('#map3leftScore').text(newVal.maps[2].leftScore);
    $('#map4leftScore').text(newVal.maps[3].leftScore);
    $('#map5leftScore').text(newVal.maps[4].leftScore);

    $('#map1rightScore').text(newVal.maps[0].rightScore);
    $('#map2rightScore').text(newVal.maps[1].rightScore);
    $('#map3rightScore').text(newVal.maps[2].rightScore);
    $('#map4rightScore').text(newVal.maps[3].rightScore);
    $('#map5rightScore').text(newVal.maps[4].rightScore);

    $('#map1name').text((newVal.maps[0].tba ? 'TBD' : newVal.maps[0].label));
    $('#map2name').text((newVal.maps[1].tba ? 'TBD' : newVal.maps[1].label));
    $('#map3name').text((newVal.maps[2].tba ? 'TBD' : newVal.maps[2].label));
    $('#map4name').text((newVal.maps[3].tba ? 'TBD' : newVal.maps[3].label));
    $('#map5name').text((newVal.maps[4].tba ? 'TBD' : newVal.maps[4].label));

    $('#map1mode').text(newVal.maps[0].mode);
    $('#map2mode').text(newVal.maps[1].mode);
    $('#map3mode').text(newVal.maps[2].mode);
    $('#map4mode').text(newVal.maps[3].mode);
    $('#map5mode').text(newVal.maps[4].mode);

    // Change map select background
    $('#map1').css('background-image', (newVal.maps[0].tba ? `url("./img/ow/maps/tba/${newVal.maps[0].mode}.png")`: `url("./img/ow/maps/${newVal.maps[0].mode}/${newVal.maps[0].name}.png")`));
    $('#map2').css('background-image', (newVal.maps[1].tba ? `url("./img/ow/maps/tba/${newVal.maps[1].mode}.png")`: `url("./img/ow/maps/${newVal.maps[1].mode}/${newVal.maps[1].name}.png")`));
    $('#map3').css('background-image', (newVal.maps[2].tba ? `url("./img/ow/maps/tba/${newVal.maps[2].mode}.png")`: `url("./img/ow/maps/${newVal.maps[2].mode}/${newVal.maps[2].name}.png")`));
    $('#map4').css('background-image', (newVal.maps[3].tba ? `url("./img/ow/maps/tba/${newVal.maps[3].mode}.png")`: `url("./img/ow/maps/${newVal.maps[3].mode}/${newVal.maps[3].name}.png")`));
    $('#map5').css('background-image', (newVal.maps[4].tba ? `url("./img/ow/maps/tba/${newVal.maps[4].mode}.png")`: `url("./img/ow/maps/${newVal.maps[4].mode}/${newVal.maps[4].name}.png")`));
});
}