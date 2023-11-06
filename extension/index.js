module.exports = function (nodecg) {
	nodecg.log.info("ETSUCON-24 bundle extension index loaded.");

	require('./overwatch')(nodecg);
	require('./bracket-ow')(nodecg);
	require('./teams')(nodecg);
};
