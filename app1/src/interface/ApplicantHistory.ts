import { ObjectId } from 'bson'
import { Document } from 'mongoose'

export interface IApplicantHistory {
    applicantId: ObjectId
    company: string
    interviewDate: Date
    screeningStatus: string
    interviewStatus: string
    offerStatus: string
    screeningNote: string
    interviewNote: string
    offerNote: string
    note: string
}

export interface IApplicantHistoryDocument extends Document, IApplicantHistory { }

export const SCREENING_STATUS = {
    PASS: 'đạt',
    REJECT: 'loại',
    EMPTY: ''
}

export const INTERVIEW_STATUS = {
    PASS: 'đạt',
    REJECT: 'loại',
    REFUSE_INTERVIEW: 'từ chối phỏng vấn',
    EMPTY: ''
}

export const OFFER_STATUS = {
    ACCEPT: 'nhận offer',
    REFUSE_OFFER: 'không nhận offer',
    EMPTY: ''
}
