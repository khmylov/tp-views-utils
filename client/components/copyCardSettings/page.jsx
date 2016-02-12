import React from 'react';
import LoadingStateWrapper from '../../views/loadingStateWrapper.jsx';

import './styles.css';

import Auth from '../../services/auth';
import Model from './models/viewTreeModel';
import CopyOperation from './models/copyOperation';
import ConfigureScreen from './views/configure.jsx';
import UpdateProgress from './views/operationStatus/updateProgress.jsx';

export default React.createClass({
    displayName: 'copyCardSettingsPage',

    propTypes: {
        auth: React.PropTypes.instanceOf(Auth).isRequired
    },

    _loadData() {
        return this._model.loadAllViews();
    },

    componentWillMount() {
        this._model = new Model();
    },

    getInitialState() {
        return {
            currentViewId: null,
            updateOperationStarted: false
        };
    },

    _scheduleOperation({sourceViewId, targetViewIds, copyOptions}) {
        if (!sourceViewId || !targetViewIds.size || !copyOptions.size || this.state.updateOperationStarted) {
            return;
        }

        const {auth} = this.props;

        const model = this._model;
        this._startOperation = log => {
            return CopyOperation.execute({
                groupModels: model.groupModels,
                fromViewId: sourceViewId,
                toViewIds: targetViewIds.toArray(),
                optionIds: copyOptions.toArray(),
                log: log,
                api: model.getApi(),
                session: auth.getSessionInfo()
            });
        };
        this.setState({updateOperationStarted: true});
    },

    render() {
        return (
            <LoadingStateWrapper
                load={this._loadData}
                createChildren={this._renderChildren}/>
        );
    },

    _renderChildren() {
        if (this.state.updateOperationStarted) {
            return (
                <UpdateProgress
                    startOperation={this._startOperation}/>
            );
        }

        return (
            <ConfigureScreen
                viewGroups={this._model.groupModels}
                runOperation={this._scheduleOperation}
                sessionInfo={this.props.auth.getSessionInfo()}/>
        );
    }
})