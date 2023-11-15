interface IBaseRes {
    '200'?: any;
    '201'?: any;

    '400'?: any;
    '401'?: any;
    '403'?: any;
    '404'?: any;
    '429'?: any;

    '500'?: any;
}

export const baseResponse = (params: IBaseRes) => {
    return {
        200: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                error_message: { type: 'string' },
                data: params['200'],
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field_name: { type: 'string' },
                            type: { type: 'string' },
                            description: { type: 'string' },
                        },
                    },
                },
            },
        },
    };
};
