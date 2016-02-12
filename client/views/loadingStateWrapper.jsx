import React from 'react';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'loadingStateWrapper',

    propTypes: {
        loadingText: T.string,
        renderErrorMessage: T.func,
        createChildren: T.func,
        load: T.func.isRequired
    },

    getDefaultProps() {
        return {
            loadingText: 'Loading...',
            renderErrorMessage(failureMessage) {
                const displayMessage = `Error occurred: ${failureMessage}`;
                return <div>{displayMessage}</div>;
            },
            createChildren() {
                return null;
            }
        };
    },

    getInitialState() {
        return {
            isLoading: true,
            failureMessage: null
        };
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
                    });
                }
            });
    },

    render() {
        return (
            <div>
                {this._renderContent()}
            </div>
        );
    },

    _renderContent() {
        const {isLoaded, failureMessage} = this.state;
        const {loadingText, renderErrorMessage} = this.props;

        if (!isLoaded) {
            return <div>{loadingText}</div>;
        }

        if (failureMessage && failureMessage.length) {
            return renderErrorMessage(failureMessage);
        }

        return this.props.createChildren();
    }
})