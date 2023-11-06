const globalTeams = nodecg.Replicant('globalTeams');

globalTeams.on('change', newVal => {
    $('#teamsList').empty();
    newVal.forEach(team => {
        const card = `<div class="card card-team" style="width: 18rem;">
        <div class="card-body">
        <img src="/assets/etsucon-24/ow-team-logos/${team.logo}" class="card-img-top card-team-logo">
        <h5 class="card-title">${team.name}</h5>
        ${team.color}<br>
        <button type="button" onclick="deleteTeam('${team.name}');" class="btn btn-danger">Delete</button> <button class="btn btn-primary" type="button" onclick="editTeam('${team.name}');">Edit</button>
        </div>
        </div>`;
        $('#teamsList').append(card);
    });
});

function editTeam(name) {
    const team = globalTeams.value.find(team => team.name === name);
    $('#editTeamLabelName').val(team.name);
    $('#editTeamName').val(team.name);
    $('#editTeamColor').val(team.color);
    $('#editTeamModal').modal('show');
}

function updateTeam(){
    const team = globalTeams.value.find(team => team.name === $('#editTeamLabelName').val());
    team.name = $('#editTeamName').val();
    let newColor = $('#editTeamColor').val();
    if (!newColor.startsWith('#')) {
        newColor = '#' + newColor;
    }
    newColor = newColor.toUpperCase();
    team.color = newColor;
    $('#editTeamModal').modal('hide');
    console.log(team);
}

function deleteTeam(name) {
    const team = globalTeams.value.find(team => team.name === name);
    if(confirm(`Are you sure you want to delete ${team.name}?`)){
        const index = globalTeams.value.indexOf(team);
        globalTeams.value.splice(index, 1);
    } else {
        return;
    }
}