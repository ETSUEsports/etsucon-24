module.exports = function (nodecg) {
	nodecg.log.info("Bracket OW Extension mounted!");

    const defaultBracktItem = { team1: { name: 'DEFAULT_TEAM_1', score: 0, color: '#bbbbbb', logo: '' }, team2: { name: 'DEFAULT_TEAM_2', score: 0, color: '#bbbbbb', logo: '' }, winner: 'none' };
    const defaultBracket = {name: 'Bracket', winner: {name: "NO_TEAM", score: 0, color: '#bbbbbb', logo: ''}, items: [defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem]}
    const bracketOW = nodecg.Replicant('bracketOW', {defaultValue: defaultBracket});

    // Listen for changes to the bracket.
    bracketOW.on('change', (newVal) => {
        nodecg.log.info('Bracket changed!');
        nodecg.sendMessage('bracketOWChanged', newVal);
    });

    nodecg.listenFor('bracketOWReset', () => {
        nodecg.log.info('Resetting bracket!');
        bracketOW.value = defaultBracket;
    });
};