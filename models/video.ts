import mongoose,{Schema,model,models} from 'mongoose';

export const V_Dimensions = {
    width: 1080,
    height: 1920
} as const;


export interface IVideo {
    _id?:mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controllers?:boolean;
    owner: {
        id: string;
        name?: string;
        email: string;
    };
    transformation?:{
        height: number;
        width: number;
        quality?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
    title: {type: String, required: true,},
    description: {type: String, required: true,},
    thumbnailUrl: {type: String, required: true,},
    videoUrl: {type: String, required: true,},
    controllers:{type: Boolean, default: true,},
    owner: {
        id: { type: String, required: true },
        name: { type: String },
        email: { type: String, required: true }
    },
    transformation: {
        height:{type: Number, default: V_Dimensions.height},
        width:{type: Number, default: V_Dimensions.width},
        quality:{type: Number, min:1, max:100} 
    }
},{ timestamps: true})

const Video = models?.Video || model<IVideo>('Video',videoSchema);
export default Video;