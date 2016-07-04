import classNames from 'classnames';
import ViewInfo from '../../models/viewInfo';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewSelectorViewItem',

    propTypes: {
        viewId: T.string.isRequired,
        itemType: T.string.isRequired,
        viewMode: T.string,
        name: T.string,
        isCurrent: T.bool.isRequired,
        setViewAsCurrent: T.func.isRequired
    },

    _setAsCurrent() {
        const {viewId, setViewAsCurrent} = this.props;
        setViewAsCurrent(viewId);
    },

    render() {
        const {name, isCurrent, viewId, itemType, viewMode} = this.props;
        const itemClassName = classNames({
            'list-group-item': true,
            'copyCardSettings__view-tree__view-item': true,
            'active': isCurrent
        });

        const displayViewType = ViewInfo.formatViewTypeShort(itemType, viewMode);
        const viewName = name || viewId || '<Unnamed>';
        const displayName = `[${displayViewType}] ${viewName}`;

        return (
            <li
                className={itemClassName}
                onClick={this._setAsCurrent}>
                <div>{displayName}</div>
            </li>
        );
    }
});