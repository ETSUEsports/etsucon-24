const bracketOW = nodecg.Replicant('bracketOW');

// Listen for changes to the bracket.
bracketOW.on('change', (newVal) => {
    console.log(newVal);
});

$("#resetBracketOW").click(() => {
    nodecg.sendMessage('bracketOWReset');
});