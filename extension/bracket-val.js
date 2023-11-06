module.exports = function (nodecg) {
	nodecg.log.info("Bracket VAL Extension mounted!");

    const defaultBracktItem = { team1: { name: 'DEFAULT_TEAM_1', score: 0, color: '#bbbbbb', logo: '' }, team2: { name: 'DEFAULT_TEAM_2', score: 0, color: '#bbbbbb', logo: '' }, winner: 'none' };
    const defaultBracket = {name: 'Bracket', winner: {name: "NO_TEAM", score: 0, color: '#bbbbbb', logo: ''}, items: [defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem, defaultBracktItem]}
    const bracketVAL = nodecg.Replicant('bracketVAL', {defaultValue: defaultBracket});

    // Listen for changes to the bracket.
    bracketVAL.on('change', (newVal) => {
        nodecg.log.info('Bracket changed!');
        nodecg.sendMessage('bracketVALChanged', newVal);
    });

    nodecg.listenFor('bracketVALReset', () => {
        nodecg.log.info('Resetting bracket!');
        bracketVAL.value = defaultBracket;
    });
};