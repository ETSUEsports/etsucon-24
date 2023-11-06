module.exports = function (nodecg) {
	nodecg.log.info("Bracket RL Extension mounted!");

    const defaultBracktItem = { team1: { name: 'DEFAULT_TEAM_1', score: 0, color: '#bbbbbb', logo: '' }, team2: { name: 'DEFAULT_TEAM_2', score: 0, color: '#bbbbbb', logo: '' }, winner: 'none' };
    const defaultBracket = {name: 'Bracket', winner: {name: "NO_TEAM", score: 0, color: '#bbbbbb', logo: ''}, items: [defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem]}
    const bracketRL = nodecg.Replicant('bracketRL', {defaultValue: defaultBracket});

    // Listen for changes to the bracket.
    bracketRL.on('change', (newVal) => {
        nodecg.log.info('Bracket changed!');
        nodecg.sendMessage('bracketRLChanged', newVal);
    });

    nodecg.listenFor('bracketRLReset', () => {
        nodecg.log.info('Resetting bracket!');
        bracketRL.value = defaultBracket;
    });
};