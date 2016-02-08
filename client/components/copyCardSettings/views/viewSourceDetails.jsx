import React from 'react';
import _ from 'lodash';
import LoadingStateWrapper from '../../../views/loadingStateWrapper.jsx';
import Immutable from 'immutable';

const T = React.PropTypes;

const SelectableView = React.createClass({
    displayName: 'selectableViewItem',
    propTypes: {
        viewId: T.string.isRequired,
        onChange: T.func.isRequired
    },
    _onChange(e) {
        const isChecked = e.target.checked;
        this.props.onChange(this.props.viewId, isChecked);
    },
    render() {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={this.props.isSelected}
                    onChange={this._onChange}/>
                {this.props.name}
            </label>
        )
    }
});

const ViewTargetSelector = React.createClass({
    displayName: 'viewTargetSelector',

    propTypes: {
        selectedViewIds: T.instanceOf(Immutable.Set).isRequired,
        onSelectedViewIdsChanged: T.func.isRequired,
        views: T.instanceOf(Immutable.Iterable).isRequired
    },

    _toggleSelectedView(viewId, isSelected) {
        const {selectedViewIds, onSelectedViewIdsChanged} = this.props;
        const newIds = isSelected ?
            selectedViewIds.add(viewId) :
            selectedViewIds.delete(viewId);

        onSelectedViewIdsChanged(newIds);
    },

    render() {
        const {selectedViewIds, views} = this.props;
        const viewItems = views.map(v => (
            <SelectableView
                key={v.key}
                viewId={v.key}
                name={v.name}
                isSelected={selectedViewIds.has(v.key)}
                onChange={this._toggleSelectedView}/>
        ));

        return (
            <div className="copyCardSettings__view-details__target-list">
                {viewItems}
            </div>
        );
    }
});

const DetailsView = React.createClass({
    displayName: 'viewSourceDetails',

    propTypes: {
        model: T.object.isRequired,
        currentViewId: T.string.isRequired
    },

    getInitialState() {
        return {
            selectedViewIds: Immutable.Set(),
            isRunningBatchUpdate: false
        }
    },

    _onSelectedViewIdsChanged(newIds) {
        this.setState({selectedViewIds: newIds});
    },

    _onRunBatchUpdate() {
        const {selectedViewIds, isRunningBatchUpdate} = this.state;
        if (isRunningBatchUpdate) {
            return;
        }

        const {model, currentViewId} = this.props;

        this.setState({isRunningBatchUpdate: true});
        model
            .copyCardSettings(currentViewId, selectedViewIds)
            .always(() => {
                if (this.isMounted()) {
                    this.setState({isRunningBatchUpdate: false});
                }
            })
    },

    render() {
        const {model} = this.props;
        const viewModels = model.getAllViews();

        return (
            <div className="copyCardSettings__view-details">
                <div className="copyCardSettings__view-details__view-info">
                    This view has the following settings: (TODO)
                </div>

                <div>
                    Choose a set of views to apply the settings to:
                </div>
                <ViewTargetSelector
                    views={viewModels}
                    selectedViewIds={this.state.selectedViewIds}
                    onSelectedViewIdsChanged={this._onSelectedViewIdsChanged}/>
                {this._renderApplyButton()}
            </div>
        )
    },

    _renderApplyButton() {
        const {selectedViewIds, isRunningBatchUpdate} = this.state;

        if (selectedViewIds.size === 0) {
            return null;
        }

        return (
            <button
                disabled={isRunningBatchUpdate}
                onClick={this._onRunBatchUpdate}>
                Apply
            </button>
        );
    }
});

export default DetailsView;