import { baseResponse } from '@utils';

export const listUser = {
    summary: 'List all user',
    description: 'Sample endpoint',
    response: baseResponse({
        '200': { type: 'string' },
        '400': {},
    }),
    request: {},
};
