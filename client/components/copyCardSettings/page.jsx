import LoadingStateWrapper from '../../views/loadingStateWrapper.jsx';

import './styles.css';

import {routes} from 'client/configuration/routing.jsx';
import Auth from '../../services/auth';
import Model from './models/viewTreeModel';
import CopyOperation from './models/copyOperation';
import ConfigureScreen from './views/configure.jsx';

export default React.createClass({
    displayName: 'copyCardSettingsPage',

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

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
        const {router} = this.context;
        const model = this._model;

        router.push({
            pathname: routes.copyCardSettingsResults,
            state: {
                startOperation(log) {
                    return CopyOperation.execute({
                        groupModels: model.groupModels,
                        fromViewId: sourceViewId,
                        toViewIds: targetViewIds.toArray(),
                        optionIds: copyOptions.toArray(),
                        log: log,
                        api: model.getApi(),
                        session: auth.getSessionInfo()
                    });
                }
            }
        });

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
            return null;
        }

        return (
            <ConfigureScreen
                viewGroups={this._model.groupModels}
                runOperation={this._scheduleOperation}
                sessionInfo={this.props.auth.getSessionInfo()}/>
        );
    }
})