import Immutable from 'immutable';

import ViewItem from './viewItem.jsx';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewSelectorViewList',

    propTypes: {
        currentViewId: T.string,
        setViewAsCurrent: T.func.isRequired,
        groupId: T.string.isRequired,
        name: T.string,
        views: T.instanceOf(Immutable.Iterable).isRequired
    },

    render() {
        const {currentViewId, views, setViewAsCurrent, name} = this.props;

        const viewElements = views.map(v =>
            <ViewItem
                key={v.key}
                viewId={v.key}
                name={v.name}
                itemType={v.itemType}
                viewMode={v.viewMode}
                isCurrent={v.key === currentViewId}
                setViewAsCurrent={setViewAsCurrent} />
        );

        if (!viewElements.size) {
            return null;
        }

        const displayName = name || '<No group>';

        return (
            <div className="panel panel-default copyCardSettings__source-tree__group">
                <div className="panel-heading copyCardSettings__view-tree__group-name">{displayName}</div>
                <ul className="list-group">
                    {viewElements}
                </ul>
            </div>
        );
    }
});
