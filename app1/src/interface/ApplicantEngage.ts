import { ObjectId } from 'bson';
import { Document } from 'mongoose';

export interface IApplicantEngage {
	content: string;
	note?: string;
	ihrNote?: string;
	user: ObjectId;
	applicant: ObjectId;
	method: string;
}

export interface IApplicantEngageDocument extends IApplicantEngage, Document {}
