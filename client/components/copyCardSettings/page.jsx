import React from 'react'
import LoadingStateWrapper from '../../views/loadingStateWrapper.jsx'

import './styles.css'

import Model from './models/viewTreeModel'

import ViewTree from './views/viewTree.jsx'
import ViewSourceDetails from './views/viewSourceDetails.jsx'

export default React.createClass({
    _loadData() {
        return this._model.loadAllViews();
    },

    componentWillMount() {
        this._model = new Model();
    },

    getInitialState() {
        return {
            currentViewId: null
        }
    },

    _setViewAsCurrent(viewId) {
        this.setState({currentViewId: viewId});
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
            <div className="copyCardSettings">
                {this._renderViewSelector()}
                <div className="copyCardSettings__view-details-container">
                    {this._renderViewDetails()}
                </div>
            </div>
        )
    },

    _renderViewSelector() {
        return <ViewTree
            model={this._model}
            currentViewId={this.state.currentViewId }
            setViewAsCurrent={this._setViewAsCurrent}/>;
    },

    _renderViewDetails() {
        const {currentViewId} = this.state;
        if (!currentViewId) {
            return <div>Pick a view from the list to copy card settings from</div>;
        }

        return (
            <ViewSourceDetails
                currentViewId={currentViewId}
                model={this._model} />
        )
    }
})