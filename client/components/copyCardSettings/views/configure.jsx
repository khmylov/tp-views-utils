import React from 'react';
import Immutable from 'immutable';

import SourceViewTree from './sourceViewSelector/groupList.jsx';
import TargetViewsTree from './targetViewList/viewTargetSelector.jsx';
import CopyOptions from './copyOptions.jsx';

import Transforms from '../models/viewTransforms';
import Validation from '../models/validation';

const T = React.PropTypes;

const copyOptionMap = Immutable.Map({
    'units-cells': {
        name: 'Customize card settings (cards)'
    }
});

export default React.createClass({
    displayName: 'copyCardSettingsConfigureScreen',
    propTypes: {
        viewGroups: T.instanceOf(Immutable.Iterable).isRequired,
        runOperation: T.func.isRequired
    },

    getInitialState() {
        return {
            sourceViewId: null,
            selectedTargetViewIds: Immutable.Set(),
            enabledOptionIds: Immutable.Set.of('units-cells')
        };
    },

    _setViewAsCurrent(newViewId) {
        this.setState({
            sourceViewId: newViewId,
            selectedTargetViewIds: Immutable.Set()
        });
    },

    _setNewSelectedViewIds(newViewIds) {
        this.setState({selectedTargetViewIds: newViewIds});
    },

    _onEnabledOptionIdsChanged(newEnabledIds) {
        this.setState({enabledOptionIds: newEnabledIds});
    },

    _onOperationSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const {sourceViewId, selectedTargetViewIds, enabledOptionIds} = this.state;
        if (!sourceViewId || !selectedTargetViewIds.size || !enabledOptionIds.size) {
            return;
        }

        this.props.runOperation({
            sourceViewId,
            targetViewIds: selectedTargetViewIds,
            copyOptions: enabledOptionIds
        })
    },

    _getSourceView() {
        return Transforms.findViewById(this.props.viewGroups, this.state.sourceViewId);
    },

    _validateViewForOperation(viewData) {
        const sourceView = this._getSourceView();
        if (!sourceView) {
            return { success: false, message: 'Unable to find source view' };
        }

        return Validation.validateViewForCopySettings(
            sourceView.getViewData(), viewData,
            this.state.enabledOptionIds);
    },

    render() {
        return (
            <div className="row">
                <div className="col-sm-2 sidebar">
                    {this._renderSourceViewSelector()}
                </div>
                <div className="col-sm-10">
                    {this._renderOptionsColumn()}
                </div>
            </div>
        );
    },

    _renderSourceViewSelector() {
        return (
            <SourceViewTree
                groups={this.props.viewGroups}
                currentViewId={this.state.sourceViewId}
                setViewAsCurrent={this._setViewAsCurrent}/>
        )
    },

    _renderOptionsColumn() {
        const {sourceViewId} = this.state;

        if (!sourceViewId) {
            return <div>Pick a view from the list to copy card settings from</div>;
        }

        const {viewGroups} = this.props;
        const sourceView = Transforms.findViewById(viewGroups, sourceViewId);

        if (!sourceView) {
            return <div>Unable to get view info</div>;
        }

        return (
            <div>
                <p>
                    <span><strong>{sourceView.name}</strong></span>
                    <br />
                    <span>This view has the following settings: (TODO)</span>
                </p>

                <br />

                <div>
                    Choose what to copy:
                </div>
                {this._renderCopyOptions()}

                <br />

                <div>
                    Choose a set of views to apply the settings to:
                </div>

                <form onSubmit={this._onOperationSubmit}>
                    {this._renderTargetViewsSelector()}
                    {this._renderApplyButton()}
                </form>
            </div>
        );
    },

    _renderCopyOptions() {
        return (
            <CopyOptions
                options={copyOptionMap}
                enabledOptionIds={this.state.enabledOptionIds}
                onEnabledChanged={this._onEnabledOptionIdsChanged}/>
        );
    },

    _renderTargetViewsSelector() {
        const {viewGroups} = this.props;
        const {selectedTargetViewIds, enabledOptionIds} = this.state;

        const sourceView = this._getSourceView();
        const sourceViewData = sourceView ? sourceView.getViewData() : null;

        const views = Transforms.flattenViews(viewGroups);
        const viewDtos = views.map(v => {
            const validationResult = sourceViewData ?
                Validation.validateViewForCopySettings(sourceViewData, v.getViewData(), enabledOptionIds) :
                {success: false, message: 'Source view was not found'};
            return {
                name: v.name,
                key: v.key,
                validationState: validationResult
            };
        });

        return (
            <TargetViewsTree
                views={viewDtos}
                selectedViewIds={selectedTargetViewIds}
                onSelectedViewIdsChanged={this._setNewSelectedViewIds}/>
        );
    },

    _renderApplyButton() {
        const {selectedTargetViewIds, enabledOptionIds} = this.state;

        const targetCount = selectedTargetViewIds.size;
        if (!targetCount || !enabledOptionIds.size) {
            return null;
        }

        const text = `Apply to ${targetCount} selected ${targetCount === 1 ? 'view' : 'views'}`;

        return (
            <button
                className="btn btn-primary"
                type="submit">
                {text}
            </button>
        );
    }
});