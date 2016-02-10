const Transforms = {
    /**
     * @param {Immutable.Iterable} groupModels
     * @returns {Immutable.Iterable}
     */
    flattenViews(groupModels) {
        return groupModels.flatMap(g => g.children);
    },

    /**
     * @param {Immutable.Iterable} groupModels
     * @param {string} viewId
     */
    findViewById(groupModels, viewId) {
        return Transforms
            .flattenViews(groupModels)
            .find(v => v.key === viewId);
    }
};

export default Transforms;