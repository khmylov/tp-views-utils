import React from 'react';
import _ from 'lodash';
import LoadingStateWrapper from '../../../views/loadingStateWrapper.jsx';
import Immutable from 'immutable';

import ViewTargetSelector from './viewTargetSelector.jsx';
import UpdateProgress from './updateProgress.jsx';

const T = React.PropTypes;

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

    _onRunBatchUpdate(e) {
        e.preventDefault();
        e.stopPropagation();

        const {selectedViewIds, isRunningBatchUpdate} = this.state;
        if (isRunningBatchUpdate) {
            return;
        }

        const {model, currentViewId} = this.props;

        this.setState({isRunningBatchUpdate: true});
        this._startOperation = () => {
            return model
                .copyCardSettings(currentViewId, selectedViewIds);
        };
    },

    render() {
        const {model, currentViewId} = this.props;
        const viewModels = model.getAllViews();
        const currentView = model.getViewById(currentViewId);
        if (!currentView) {
            return <div>Unable to get view info</div>;
        }

        const {isRunningBatchUpdate} = this.state;
        if (isRunningBatchUpdate) {
            return (
                <UpdateProgress
                    log={model.log}
                    startOperation={this._startOperation}/>
            );
        }

        return (
            <div>
                <p>
                    <span><strong>{currentView.name}</strong></span>
                    <br />
                    <span>This view has the following settings: (TODO)</span>
                </p>

                <div>
                    Choose a set of views to apply the settings to:
                </div>

                <form onSubmit={this._onRunBatchUpdate}>
                    <ViewTargetSelector
                        views={viewModels}
                        selectedViewIds={this.state.selectedViewIds}
                        onSelectedViewIdsChanged={this._onSelectedViewIdsChanged}/>
                    {this._renderApplyButton()}
                </form>
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
                className="btn btn-primary"
                disabled={isRunningBatchUpdate}
                type="submit">
                Apply
            </button>
        );
    }
});

export default DetailsView;