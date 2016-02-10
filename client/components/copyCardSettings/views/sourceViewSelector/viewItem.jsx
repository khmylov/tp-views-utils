import React from 'react';
import classNames from 'classnames';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewSelectorViewItem',

    propTypes: {
        viewId: T.string.isRequired,
        name: T.string,
        isCurrent: T.bool.isRequired,
        setViewAsCurrent: T.func.isRequired
    },

    _setAsCurrent() {
        const {viewId, setViewAsCurrent} = this.props;
        setViewAsCurrent(viewId);
    },

    render() {
        const {name, isCurrent, viewId} = this.props;
        const itemClassName = classNames({
            'list-group-item': true,
            'copyCardSettings__view-tree__view-item': true,
            'active': isCurrent
        });

        const displayName = name || viewId || '<Unnamed>';

        return (
            <li
                className={itemClassName}
                onClick={this._setAsCurrent}>
                <div>{displayName}</div>
            </li>
        );
    }
});