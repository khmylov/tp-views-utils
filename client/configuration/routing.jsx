import _ from 'lodash';

import {Router, Route, browserHistory} from 'react-router';

import App from 'client/App.jsx';
import CopyCardSettingsPage from 'client/components/copyCardSettings/page.jsx';
import CopyCardSettingsProgressPage from 'client/components/copyCardSettings/views/operationStatus/updateProgress.jsx';
import SignInPage from 'client/components/signIn/page.jsx';

export const routes = {
    copyCardSettings: '/actions/copyCardSettings',
    copyCardSettingsResults: '/actions/copyCardSettings/progress',
    login: '/login'
};

/* eslint no-console: 0 */
export function createRouter({auth}) {
    function requireAuth(nextState, replace) {
        const {pathname} = nextState.location;
        console.log('requireAuth()', pathname);
        if (_.includes(['/', routes.login, routes.logout], pathname)) {
            console.log('Allowed anonymous access');
            return;
        }

        const isLoggedIn = auth.isLoggedIn();
        console.log('Is logged in: ', isLoggedIn);

        if (!isLoggedIn) {
            replace({
                pathname: routes.login,
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
        }
    }

    function createComponent(Component, props) {
        return <Component {...props} auth={auth} />;
    }

    return (
        <Router history={browserHistory} createElement={createComponent}>
            <Route path="/" component={App} onEnter={requireAuth}>
                <Route path={routes.login} component={SignInPage} />
                <Route path={routes.copyCardSettings} component={CopyCardSettingsPage} />
                <Route path={routes.copyCardSettingsResults} component={CopyCardSettingsProgressPage} />
            </Route>
        </Router>
    );
}