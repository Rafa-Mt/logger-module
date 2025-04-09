import { Request, Response, NextFunction } from "express";

export const logRoute = (req: Request, res: Response, next: NextFunction) => {
    const { method, path } = req;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const body = JSON.stringify(req.body);
    const params = JSON.stringify(req.params);

    res.locals.logs = {
        method,
        path,
        ip,
        body,
        params,
        startTime: new Date()
    }

    const logData = () => {
        const logData = res.locals.logs;
        const endTime = new Date();
        const duration = endTime.getTime() - res.locals.logs.startTime.getTime();
        
        console.log(logData);
    }

    const originalSend = res.send;
    const originlJson = res.json;
    res.send = function (body: any) {
        logData();
        return originalSend.call(this, body);
    }

    res.json = function (body: any) {
        logData();
        return originlJson.call(this, body);
    }
    
    next();
}