const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/etsucon-24/ow-team-logos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fs = require('fs');

const upload = multer({ storage: storage });
module.exports = function (nodecg) {
	nodecg.log.info("Team Extension mounted!");
    const globalTeams = nodecg.Replicant('globalTeams', {defaultValue: []});

    // Express router for the dashboard.
    const dashboardRouter = nodecg.Router();

    dashboardRouter.get('/teams', (req, res) => {
        res.send(globalTeams.value);
    });

    dashboardRouter.post('/team', upload.single("file"), (req, res) => {
        let team = {name: '', logo:'', color: '#000000'};
        team.name = req.body.name;
        team.color = req.body.color;
        team.logo = req.file.originalname;
        globalTeams.value.push(team);
        res.send(team);
    });

    dashboardRouter.put('/team/:id', (req, res) => {
        let team = globalTeams.value.find(team => team.name == req.body.name);
        team.color = req.body.color;
        res.send(team);
    });

    dashboardRouter.delete('/team', (req, res) => {
        let team = globalTeams.value.find(team => team.name == req.body.name);
        globalTeams.value.splice(globalTeams.value.indexOf(team), 1);
        // Delete the logo file.
        fs.unlinkSync('./assets/etsucon-24/ow-team-logos/' + team.logo);
        res.send(team);
    });

    // Add routes to NodeCG.
    nodecg.mount('/etsucon-24', dashboardRouter);
};
