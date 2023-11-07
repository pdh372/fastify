import mongoose, { Document, model, Schema } from 'mongoose';
mongoose.connect('mongodb://root:bk123456@localhost:27017/fastify?authSource=admin');

interface ITrack extends Document {
    message: string;
    timestamp: Date;
}

const schema = new Schema<ITrack>(
    {
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: false },
    },
);

const Track = model<ITrack & Document>('Track', schema);

const MongodbCollection = {
    Track,
};

export { MongodbCollection };
