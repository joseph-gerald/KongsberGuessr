import { NextApiRequest, NextApiResponse } from "next";
import Session from "../models/Session";
import User from "../models/User";
import Fingerprint from "../models/Fingerprint";
import tracking_utils from "./tracking_utils";

async function sha1(str: string): Promise<string> {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("sha-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = btoa(String.fromCharCode(...hashArray)).replaceAll("=", "");
    return hashHex;
}

function isMismatchingIP(ip1: any, ip2: any) {
    return false; // ip1 != ip2;
}

async function process(hash: string, data: string, useragent: string) {
    const parsed_data = atob(String.fromCharCode(...atob(data).split(",").map(x => parseInt(x)))).split("||")
    const fields = ["AUDIO_FINGERPRINT", "CANVAS_FINGERPRINT", "CANVAS_DATA", "USERAGENT", "TIMEZONE_OFFSET", "PLUGINS", "MIME_TYPES", "ENCODING_FINGERPRINT", "LANGUAGES", "LANGUAGE", "WEBDRIVER", "PLATFORM", "BROWSER", "WEBGL_VENDOR", "WEBGL_RENDERER", "BATTERY_FINGERPRINT", "DISPLAY_FINGERPRINT", "SCRIPT","SCRIPT_1", "DO_NOT_TRACK", "COOKIES_ENABLED"]
    const data_object: any = {};
    const tracking_data = [];
    let index = 0;

    for (const field of fields) {
        if (index < 15) tracking_data.push(parsed_data[index])
        data_object[field] = parsed_data[index++]
    }

    data_object.SCRIPT += "||"+data_object.SCRIPT_1;
    delete data_object.SCRIPT_1;

    // See if the hash matches the data (tampered data or hash)
    const computed_hash = await sha1("SaltySaltChip"+btoa(tracking_data.join("||")));
    const integrity = computed_hash == hash;

    // See if the script is the latest version
    const latestSource = (await (await fetch("https://thisisadomain.lol/scripts/fp.js")).text());
    const untampered = latestSource.includes(data_object.SCRIPT);

    // See if the useragent is the same
    const sameUseragent = useragent == data_object.USERAGENT; 

    /*console.log({
        integrity,
        untampered,
        sameUseragent
    })*/

    // Verdict from both checks
    const passed = integrity && untampered && sameUseragent;

    return { data_object, passed }
}

function isNotJSON(req: NextApiRequest) {
    return typeof req.body !== 'object' || req.headers['content-type'] != "application/json";
}

async function getData(token: string) {
    const session = await Session.findOne({ token: token });
    const user = await User.findOne({ _id: session.user })

    return { user, session };
}

async function validateBody(token: any, useragent: any, ip_address: any) {
    if (!token) {
        return "Missing Token";
    }

    const session = await Session.findOne({ token: token });

    if (!session) {
        return "Invalid Token";
    }

    const user = await User.findOne({ _id: session.user })
    const fingerprint = await Fingerprint.findOne({ _id: session.fingerprint })
    const fp_data = JSON.parse(fingerprint.data);


    const useragent_mismatch = fp_data.USERAGENT != useragent;
    const ip_mismatch = tracking_utils.isMismatchingIP(session.ip_address, ip_address);

    if (useragent_mismatch || ip_mismatch) {
        return "Invalid";
    }

    return { token, user, session, fp_data };
}

async function validateData(req: NextApiRequest, res: NextApiResponse, expectingJson: boolean = true) {
    if (isNotJSON(req) && expectingJson) {
        res.status(400).json({ error: 'Expected a JSON body' })
        return "Expected a JSON body";
    }

    let token = req.cookies.token;
    
    const useragent = req.headers['user-agent'];
    const ip_address = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;

    const validation = await validateBody(token, useragent, ip_address);

    if (typeof validation == "string") {
        res.status(400).json({ error: validation })
        return validation;
    }

    return validation;
}

export default { process, isMismatchingIP, isNotJSON, validateData, validateBody };