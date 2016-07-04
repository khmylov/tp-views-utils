export default {
    formatTypes({types} = {}) {
        return types && types.length ? types.join(', ') : '<Nothing>';
    },

    formatViewType(itemType, viewMode) {
        switch (itemType) {
            case 'board':
                switch (viewMode) {
                    case 'board':
                    case '':
                        return 'Board';
                    case 'list':
                        return 'One-by-one';
                    case 'timeline':
                        return 'Timeline';
                    case 'newlist':
                        return 'List';
                }
                
                break;
            case 'dashboard':
                return 'Dashboard';
            case 'customreport':
                return 'Graphical report';
        }

        return `<Unknown '${itemType}-${viewMode}'>`;
    },
    
    formatViewTypeShort(itemType, viewMode) {
        switch (itemType) {
            case 'board':
                switch (viewMode) {
                    case 'board':
                        return 'B';
                    case 'list':
                        return 'O';
                    case 'timeline':
                        return 'T';
                    case 'newlist':
                        return 'L';
                }
                break;
            case 'dashboard':
                return 'D';
            case 'customreport':
                return 'R';
        }

        return '?';
    }
};