const fs = require('fs');

module.exports = function (nodecg) {
	nodecg.log.info("Overwatch Extension mounted!");
    const defaultLeftTeam = {name: 'Left Team', score: 0, color: '#000000', logo: ''};
    const defaultRightTeam = {name: 'Right Team', score: 0, color: '#000000', logo: ''};
    const defaultMatchStats = {currentMap: 1, bestOf: 5, mode: 'control', attacker: 'left', maps: [{
        tba: true,
        inprogress: false,
        map: 1,
        mode: 'control',
        name: 'TBA',
        label: 'tba',
        leftScore: 0,
        rightScore: 0,
        winningTeam: 'none'
    }, {
        tba: true,
        inprogress: false,
        map: 2,
        mode: 'hybrid',
        name: 'TBA',
        label: 'tba',
        leftScore: 0,
        rightScore: 0,
        winningTeam: 'none'
    }, {
        tba: true,
        inprogress: false,
        map: 3,
        mode: 'flash',
        name: 'TBA',
        label: 'tba',
        leftScore: 0,
        rightScore: 0,
        winningTeam: 'none'
    }, {
        tba: true,
        inprogress: false,
        map: 4,
        mode: 'push',
        name: 'TBA',
        label: 'tba',
        leftScore: 0,
        rightScore: 0,
        winningTeam: 'none'
    }, {
        tba: true,
        inprogress: false,
        map: 5,
        mode: 'escort',
        name: 'TBA',
        label: 'tba',
        leftScore: 0,
        rightScore: 0,
        winningTeam: 'none'
    }]};

    // Declare replicants.
    const owLeftTeam = nodecg.Replicant('owLeftTeam', {defaultValue: defaultLeftTeam});
    const owRightTeam = nodecg.Replicant('owRightTeam', {defaultValue: defaultRightTeam});
    const owMatchStats = nodecg.Replicant('owMatchStats', {defaultValue: defaultMatchStats});
    const globalTeams = nodecg.Replicant('globalTeams', {defaultValue: []});

    // Express router for the dashboard.
    const dashboardRouter = nodecg.Router();

    // Declare routes.
    dashboardRouter.get('/ow/leftTeam', (req, res) => {
        res.send(owLeftTeam.value);
    });

    dashboardRouter.get('/ow/rightTeam', (req, res) => {
        res.send(owRightTeam.value);
    });

    dashboardRouter.get('/ow/matchStats', (req, res) => {
        res.send(owMatchStats.value);
    });

    dashboardRouter.post('/ow/reset', (req, res) => {
        owLeftTeam.value = defaultLeftTeam;
        owRightTeam.value = defaultRightTeam;
        owMatchStats.value = defaultMatchStats;
        res.send({message: "Reset successful."});
    });

    dashboardRouter.get('/ow/maps', (req, res) => {
        fs.readFile('./bundles/etsucon-24/ow-maps.json', (err, data) => {
            if (err) throw err;
            const maps = JSON.parse(data);
            res.send(maps);
        });
    });

    dashboardRouter.get('/ow/maps/:type', (req, res) => {
        fs.readFile('./bundles/etsucon-24/ow-maps.json', (err, data) => {
            if (err) throw err;
            const maps = JSON.parse(data);
            const type = req.params.type;
            const filteredMaps = maps[type];
            res.send(filteredMaps);
        });
    });

    // Add routes to NodeCG.
    nodecg.mount('/etsucon-24', dashboardRouter);

    // NodeCG message reset listener.
    nodecg.listenFor('owReset', () => {
        console.log("Resetting replicants.");
        owLeftTeam.value = defaultLeftTeam;
        owRightTeam.value = defaultRightTeam;
        owMatchStats.value = defaultMatchStats;
    });

    nodecg.listenFor('owDeleteAllTeams', (data) => {
        globalTeams.value = [];
    });
};
