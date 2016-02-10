import React from 'react';
import Immutable from 'immutable';

import SourceViewTree from './sourceViewSelector/groupList.jsx';
import TargetViewsTree from './targetViewList/viewTargetSelector.jsx';
import CopyOptions from './copyOptions.jsx';

import Transforms from '../models/viewTransforms';

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
            enabledOptionIds: Immutable.Set()
        };
    },

    _setViewAsCurrent(newViewId) {
        this.setState({sourceViewId: newViewId});
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
        const views = Transforms.flattenViews(this.props.viewGroups);

        return (
            <TargetViewsTree
                views={views}
                selectedViewIds={this.state.selectedTargetViewIds}
                onSelectedViewIdsChanged={this._setNewSelectedViewIds}/>
        );
    },

    _renderApplyButton() {
        const {selectedTargetViewIds, enabledOptionIds} = this.state;

        if (!selectedTargetViewIds.size || !enabledOptionIds.size) {
            return null;
        }

        return (
            <button
                className="btn btn-primary"
                type="submit">
                Apply
            </button>
        );
    }
});