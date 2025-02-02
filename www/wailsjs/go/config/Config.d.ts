// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {config} from '../models';
import {context} from '../models';

export function GetConfig():Promise<config.Config>;

export function GetConfigDir():Promise<string>;

export function Load():Promise<void>;

export function LoadCustomCSS():Promise<Array<string>>;

export function Save():Promise<void>;

export function SetContext(arg1:context.Context):Promise<void>;

export function SetFilter(arg1:config.Filter):Promise<void>;

export function SetShowCheckboxes(arg1:boolean):Promise<void>;

export function SetShowHidden(arg1:boolean):Promise<void>;

export function SetTheme(arg1:string):Promise<void>;

export function SetView(arg1:string):Promise<void>;
