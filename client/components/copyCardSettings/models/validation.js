import _ from 'lodash';

const validationOk = Object.freeze({success: true});
const validationError = message => ({success: false, error: message});
const validationWarning = message => ({success: true, warning: message});

function getCellTypes({cells}) {
    return _.orderBy(cells ? cells.types || [] : [], _.identity);
}

const Validation = {
    _validationRules: {
        'cellTypes'(sourceViewData, targetViewData) {
            const sourceCellTypes = getCellTypes(sourceViewData);
            const targetCellTypes = getCellTypes(targetViewData);

            if (!sourceCellTypes.length) {
                return validationError('Source view doesn\'t have configured cards');
            }

            if (!targetCellTypes.length) {
                return validationError('Target view doesn\'t have configured cards');
            }

            if (_.isEqual(sourceCellTypes, targetCellTypes)) {
                return validationOk;
            }

            return validationError(`Views have different cell types. Source: '${sourceCellTypes.join(', ')}'. Target: '${targetCellTypes.join(', ')}'`);
        },

        'viewTypeAndMode'(sourceViewData, targetViewData) {
            const sourceItemType = sourceViewData.itemType;

            if (sourceItemType !== 'board') {
                return validationError(`Source view type should be 'board'. Actual view type: '${sourceItemType}'`);
            }

            const sourceViewMode = sourceViewData.viewMode;
            if (sourceViewMode !== '' && sourceViewMode !== 'board') {
                return validationError(`Source view mode should be 'board'. Actual view mode: '${sourceViewMode}'`);
            }

            const targetItemType = targetViewData.itemType;
            if (targetItemType !== sourceItemType) {
                return validationError(`Source and target item type should match. Source: '${sourceItemType}'. Target: '${targetItemType}'`);
            }

            const targetViewMode = targetViewData.viewMode;
            if (sourceViewMode !== targetViewMode) {
                return validationError(`Source and target view mode should match. Source: '${sourceViewMode}. Target: '${targetViewMode}'`);
            }

            return validationOk;
        },

        'accessRights'(sourceViewData, targetViewData, validationContext) {
            const {userId, isAdministrator} = validationContext.sessionInfo;

            if (isAdministrator) {
                return validationOk;
            }

            const {ownerIds} = targetViewData;
            if (!_.isArray(ownerIds)) {
                return validationError('You don\'t have required permissions to change settings for this view (no ownerIds on target)');
            }

            if (!_.includes(ownerIds, userId)) {
                return validationError('You must be one of the owners of this view to change its settings');
            }

            return validationOk;
        }
    },

    validateViewForCopySettings(sourceViewData, targetViewData, validationContext) {
        const brokenRule = _
            .chain(Validation._validationRules)
            .map(rule => rule(sourceViewData, targetViewData, validationContext))
            .find(validationResult => !validationResult.success)
            .value();

        return brokenRule || validationOk;
    },

    validateSourceView(sourceViewData, validationContext) {
        const {copyOptions} = validationContext;
        var messages = [];

        if (_.includes(copyOptions, 'units-cells') && !sourceViewData.cardSettings) {
            messages.push('Source doesn\'t have custom card settings (perhaps it has default set of units?)');
        }

        if (_.includes(copyOptions, 'colors-cells') && !sourceViewData.colorSettings) {
            messages.push('Source doesn\'t have custom visual encoding settings');
        }

        if (messages.length) {
            return validationWarning(messages.join('\n'));
        }

        return validationOk;
    }
};

export default Validation;