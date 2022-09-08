import * as React from "react";

export type SenderType={
    row:number;
    col:number;
}
export type RecipientType={
    row:number;
    col:number;
    new_value: string;
}
export type StepType={
    senders: SenderType[];
    recipients: RecipientType[];
    error_messages: string[];
}
export type JsonDataType = {
    rows: number;
    cols: number;
    initial_value:string;
    steps: StepType[];
}
export type Status = "Normal" | "Send" | "Recieve" 