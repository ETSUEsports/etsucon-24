// Initalize replicants
const owLeftTeam = nodecg.Replicant('owLeftTeam');
const owRightTeam = nodecg.Replicant('owRightTeam');
const owMatchStats = nodecg.Replicant('owMatchStats');

// On replicant change, update the DOM using jQuery.
owLeftTeam.on('change', (newVal, oldVal) => {
    $('#left_name_text').text(newVal.name);
    if(oldVal != undefined && newVal.score > oldVal.score){
        console.log("Score changed")
        $("#left-score-transition").css('opacity', '1');
        $("#left-score-transition").css('height', '50px');
        setTimeout(() => {
            $("#left-score-transition").css('width', '0px');
            $('#left_score_text').text(newVal.score);
        }, 500);
        setTimeout(() => {
            $("#left-score-transition").css('opacity', '0');
            $("#left-score-transition").css('height', '0px');
            $("#left-score-transition").css('width', '569px');
        }, 1000);
    }
    if(oldVal == undefined){
        $('#left_score_text').text(newVal.score);
    }
    $('#left_logo_img').attr('src', newVal.logo);
});

owRightTeam.on('change', (newVal, oldVal) => {
    $('#right_name_text').text(newVal.name);
    if(oldVal != undefined && newVal.score > oldVal.score){
        console.log("Score changed")
        $("#right-score-transition").css('opacity', '1');
        $("#right-score-transition").css('height', '50px');
        setTimeout(() => {
            $("#right-score-transition").css('width', '0px');
            $('#right_score_text').text(newVal.score);
        }, 500);
        setTimeout(() => {
            $("#right-score-transition").css('opacity', '0');
            $("#right-score-transition").css('height', '0px');
            $("#right-score-transition").css('width', '569px');
        }, 1000);
    }
    if(oldVal == undefined){
        $('#right_score_text').text(newVal.score);
    }
    $('#right_logo_img').attr('src', newVal.logo);
});

owMatchStats.on('change', newVal => {
    console.log(newVal);
    $('#match_stats_map_number').text(newVal.currentMap);
    $('#match_stats_best_of').text(newVal.bestOf);
    switch(newVal.mode) {
        case 'control':
            $('.name').css('width', 'var(--name-score)');
            $('.attack_defend_icon').css('visibility', 'hidden');
            break;
        case 'hybrid':
            $('.name').css('width', 'var(--name-ad)');
            $('.attack_defend_icon').css('visibility', 'visible');
            break;
        case 'escort':
            $('.name').css('width', 'var(--name-ad)');
            $('.attack_defend_icon').css('visibility', 'visible');
            break;
        case 'push':
            $('.name').css('width', 'var(--name-score)');
            $('.attack_defend_icon').css('visibility', 'hidden');
            break;
        case 'flash':
            $('.name').css('width', 'var(--name-score)');
            $('.attack_defend_icon').css('visibility', 'hidden');
            break;
        default:
            break;
    }

    if(newVal.attacker == "left"){
        $('#left_attack_defend').addClass('attack');
        $('#left_attack_defend').removeClass('defend');
        $('#right_attack_defend').addClass('defend');
        $('#right_attack_defend').removeClass('attack');
    } else {
        $('#left_attack_defend').addClass('defend');
        $('#left_attack_defend').removeClass('attack');
        $('#right_attack_defend').addClass('attack');
        $('#right_attack_defend').removeClass('defend');
    }
});