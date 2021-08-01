import { Session, SessionData } from "express-session";

function authenticatedSession(session: Session & Partial<SessionData>): boolean {
    return <boolean>session.user?.authenticated;
}

export default authenticatedSession;
