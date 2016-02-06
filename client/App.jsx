import React from 'react'


import ViewTreeView from './views/viewTree.jsx';
import LoadingStateWrapper from './views/loadingStateWrapper.jsx';

export default React.createClass({
    _loadData() {
        return this.props.model.loadAllViews();
    },

    render() {
        return (
            <div>
                <LoadingStateWrapper
                    load={this._loadData}
                    createChildren={this._renderChildren} />
            </div>
        );
    },

    _renderChildren() {
        const {model} = this.props;
        return <ViewTreeView model={model} />;
    }
})