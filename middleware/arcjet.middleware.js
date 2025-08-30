import aj from "../config/arcjet.js";

const protectionMiddleware = async function protectionMiddleware(req, res, next) {

    try {
        const decision = await aj.protect(req, { requested: 1 });
        if (decision.isDenied()) {
            if(decision.reason.isBot()){res.status(403).json({error:"bot detected"})}
            if( decision.reason.isRateLimit()){res.status(429).json({error:"rate exceeded"})}

            res.status(403).json({error:"Access denied"});
        }
        next()
    }catch (e) {
        console.log(`error from arcjet ${e}`)
        next(e)
    }


}

export default protectionMiddleware;