import React from 'react'

export default React.createClass({
    getInitialState() {
        return {
            isLoading: true,
            failureMessage: null
        }
    },

    componentDidMount() {
        this.props
            .load()
            .done(() => {
                if (this.isMounted()) {
                    this.setState({
                        isLoaded: true,
                        failureMessage: null
                    });
                }
            })
            .fail(e => {
                if (this.isMounted()) {
                    this.setState({
                        isLoaded: true,
                        failureMessage: e
                    })
                }
            })
    },

    render() {
        return (
            <div>
                {this._renderContent()}
            </div>
        )
    },

    _renderContent() {
        const {isLoaded, failureMessage} = this.state;
        if (!isLoaded) {
            return <div>Loading...</div>;
        }

        if (failureMessage && failureMessage.length) {
            const displayMessage = `Error occurred: ${failureMessage}`;
            return <div>{displayMessage}</div>;
        }

        return this.props.createChildren();
    }
})