import guard from 'shared/utils/guard';

function defineProp(target, name, value) {
    Object.defineProperty(target, name, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
    });
}

/**
 * @class SessionInfo
 */
export default class SessionInfo {
    constructor({accountName, firstName, lastName, userId, isAdministrator}) {
        defineProp(this, 'accountName', guard.notEmptyString(accountName, 'accountName'));
        defineProp(this, 'firstName', guard.notEmptyString(firstName, 'firstName'));
        defineProp(this, 'lastName', guard.notEmptyString(lastName, 'lastName'));
        defineProp(this, 'userId', guard.notNull(userId, 'userId'));
        defineProp(this, 'isAdministrator', isAdministrator || false);
    }
};