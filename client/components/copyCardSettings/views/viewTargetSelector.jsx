import React from 'react';
import Immutable from 'immutable';

import SelectableView from './selectableView.jsx';

const T = React.PropTypes;

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

export default ViewTargetSelector;