module.exports = function (nodecg) {
	nodecg.log.info("ETSUCON-24 bundle extension index loaded.");

	require('./overwatch')(nodecg);
	require('./bracket-ow')(nodecg);
	require('./bracket-val')(nodecg);
	require('./bracket-rl')(nodecg);
	require('./bracket-ssbu')(nodecg);
	require('./teams')(nodecg);
};
