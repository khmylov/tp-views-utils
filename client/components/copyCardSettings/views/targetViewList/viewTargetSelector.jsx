import React from 'react';
import Immutable from 'immutable';
import SelectableView from './selectableView.jsx';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewTargetSelector',

    propTypes: {
        selectedViewIds: T.instanceOf(Immutable.Set).isRequired,
        onSelectedViewIdsChanged: T.func.isRequired,
        viewGroups: T.instanceOf(Immutable.Iterable).isRequired
    },

    _toggleSelectedView(viewId, isSelected) {
        const {selectedViewIds, onSelectedViewIdsChanged} = this.props;
        const newIds = isSelected ?
            selectedViewIds.add(viewId) :
            selectedViewIds.delete(viewId);

        onSelectedViewIdsChanged(newIds);
    },

    render() {
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
                    {this._renderTableRows()}
                </tbody>
            </table>
        );
    },

    _renderTableRows() {
        const rows = [];

        const {selectedViewIds, viewGroups} = this.props;

        viewGroups.forEach(viewGroup => {
            const groupDisplayName = viewGroup.groupName ? `[${viewGroup.groupName}]` : '<No group>';
            rows.push((
                <tr key={viewGroup.groupId} className="active">
                    <td colSpan="4">{groupDisplayName}</td>
                </tr>
            ));

            viewGroup.children.forEach(v => {
                rows.push((
                    <SelectableView
                        key={v.key}
                        viewId={v.key}
                        name={v.name}
                        viewData={v.viewData}
                        validationState={v.validationState}
                        isSelected={selectedViewIds.has(v.key)}
                        onChange={this._toggleSelectedView}/>
                ));
            });
        });

        return rows;
    }
});