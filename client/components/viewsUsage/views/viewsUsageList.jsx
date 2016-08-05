import {ViewItemUsageInfo} from '../models/viewsUsageModel';
import Immutable from 'immutable';
import moment from 'moment';

const ViewUsageItemView = React.createClass({
    displayName: 'viewUsageItem',
    propTypes: {
        usageInfo: React.PropTypes.instanceOf(ViewItemUsageInfo).isRequired
    },
    render() {
        const {usageInfo} = this.props;
        const {viewName, groupName, usageCount, lastUsageDate, viewId} = usageInfo;
        const displayName = groupName && groupName.length ? `${viewName} (in '${groupName}')` : viewName;
        const displayDate = lastUsageDate ? moment(lastUsageDate).fromNow() : 'Not used';
        return (
            <tr>
                <td>{displayName}</td>
                <td>{usageCount}</td>
                <td title={lastUsageDate}>{displayDate}</td>
                <td>{viewId}</td>
            </tr>
        );
    }
});

export const ViewsUsageListView = React.createClass({
    displayName: 'viewsUsageList',

    propTypes: {
        views: React.PropTypes.instanceOf(Immutable.List).isRequired
    },

    render() {
        const usageItems = this.props.views.map(usageInfo => (
            <ViewUsageItemView key={usageInfo.viewId} usageInfo={usageInfo}/>
        ));

        return (
            <table className="table table-condensed table-bordered">
                <thead>
                    <tr>
                        <th>View name</th>
                        <th>Usages</th>
                        <th>Last usage date</th>
                        <th>View id</th>
                    </tr>
                </thead>
                <tbody>
                    {usageItems}
                </tbody>
            </table>
        );
    }
});