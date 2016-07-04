import _ from 'lodash';

const validationOk = Object.freeze({success: true});
const validationError = message => ({success: false, error: message});
const validationWarning = message => ({success: true, warning: message});

const getSpaceTypes = definition =>
    _.orderBy(definition ? definition.types || [] : [], _.identity);

const getCellTypes = ({cells}) => getSpaceTypes(cells);
const getXTypes = ({x}) => getSpaceTypes(x);
const getYTypes = ({y}) => getSpaceTypes(y);

const getTypesText = types => types.length ? types.join(', ') : '<Nothing>';

const ITEM_TYPE_BOARD = 'board';

const Validation = {
    _validationRules: {
        'viewTypeAndMode'(sourceViewData, targetViewData) {
            const sourceItemType = sourceViewData.itemType;

            if (sourceItemType !== ITEM_TYPE_BOARD) {
                return validationError(`Source view type should be '${ITEM_TYPE_BOARD}'. Actual view type: '${sourceItemType}'`);
            }

            const targetItemType = targetViewData.itemType;
            if (targetItemType !== sourceItemType) {
                return validationError(`Source and target item type should match. Source: '${sourceItemType}'. Target: '${targetItemType}'`);
            }

            const sourceViewMode = sourceViewData.viewMode;
            const targetViewMode = targetViewData.viewMode;

            if (sourceViewMode !== targetViewMode) {
                return validationError(`Source and target have different view modes: ${sourceViewMode} and ${targetViewMode}.`);
            }

            return validationOk;
        },

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

            return validationError(`Views have different cell types. Source: '${getTypesText(sourceCellTypes)}'. Target: '${getTypesText(targetCellTypes)}'`);
        },

        'axesForLists'(sourceViewData, targetViewData) {
            const sourceXTypes = getXTypes(sourceViewData);
            const targetXTypes = getXTypes(targetViewData);

            if (!_.isEqual(sourceXTypes, targetXTypes)) {
                return validationWarning(`Source and target view have different X axes: ${getTypesText(sourceXTypes)} and ${getTypesText(targetXTypes)}. Proceed with caution, you may break things!`);
            }

            const sourceYTypes = getYTypes(sourceViewData);
            const targetYTypes = getYTypes(targetViewData);

            if (!_.isEqual(sourceYTypes, targetYTypes)) {
                return validationWarning(`Source and target view have different Y axes: ${getTypesText(sourceXTypes)} ${getTypesText(targetXTypes)}. Proceed with caution, you may break things!`);
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
        const ruleResults = _.map(
            Validation._validationRules,
            rule => rule(sourceViewData, targetViewData, validationContext));

        const errorRules = _.filter(ruleResults, result => !result.success);
        if (errorRules.length) {
            const aggregatedErrorMessage = _.map(errorRules, x => x.error).join('\n');
            return validationError(aggregatedErrorMessage);
        }

        const warningRules = _.filter(ruleResults, result => result.warning);
        if (warningRules.length) {
            const aggregatedWarningMessage = _.map(warningRules, x => x.warning).join('\n');
            return validationWarning(aggregatedWarningMessage);
        }

        return validationOk;
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