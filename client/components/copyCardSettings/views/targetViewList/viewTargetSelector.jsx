import React from 'react';
import Immutable from 'immutable';
import SelectableView from './selectableView.jsx';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewTargetSelector',

    propTypes: {
        selectedViewIds: T.instanceOf(Immutable.Set).isRequired,
        onSelectedViewIdsChanged: T.func.isRequired,
        views: T.instanceOf(Immutable.Iterable).isRequired,
        displayUnavailable: T.bool.isRequired
    },

    _toggleSelectedView(viewId, isSelected) {
        const {selectedViewIds, onSelectedViewIdsChanged} = this.props;
        const newIds = isSelected ?
            selectedViewIds.add(viewId) :
            selectedViewIds.delete(viewId);

        onSelectedViewIdsChanged(newIds);
    },

    render() {
        const {selectedViewIds, views, displayUnavailable} = this.props;
        const viewsToDisplay = displayUnavailable ?
            views :
            views.filter(({validationState}) => validationState.success);

        const viewItems = viewsToDisplay.map(v => {
            return <SelectableView
                key={v.key}
                viewId={v.key}
                name={v.name}
                viewData={v.viewData}
                validationState={v.validationState}
                isSelected={selectedViewIds.has(v.key)}
                onChange={this._toggleSelectedView}/>;
        });

        return (
            <table className="table table-condensed table-bordered">
                <thead>
                    <tr>
                        <th>Pick?</th>
                        <th>View type</th>
                        <th>Cell types</th>
                        <th>Errors</th>
                    </tr>
                </thead>
                <tbody>
                    {viewItems}
                </tbody>
            </table>
        );
    }
});