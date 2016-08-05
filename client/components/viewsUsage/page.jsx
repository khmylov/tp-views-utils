import LoadingStateWrapper from '../../views/loadingStateWrapper.jsx';
import {ViewsUsageModel} from './models/viewsUsageModel';
import {ViewsUsageListView} from './views/viewsUsageList.jsx';

export const ViewsUsagePage = React.createClass({
    displayName: 'viewsUsagePage',

    componentWillMount() {
        this._model = new ViewsUsageModel();
    },

    _loadData() {
        return this._model.loadAllViewUsages();
    },

    render() {
        return (
            <LoadingStateWrapper
                load={this._loadData}
                createChildren={this._renderChildren}/>
        );
    },

    _renderChildren() {
        return (
            <ViewsUsageListView views={this._model.viewItems}/>
        );
    }
});